using Application.Interfaces;
using Application.Models;
using Application.Models.Parameters;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services;

public class UserService: IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMailService _mailService;
    public UserService(IUserRepository userRepository, IUnitOfWork unitOfWork, IMailService mailService)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _mailService = mailService;
    }

    public async Task<PaginatedList<UserDto>> GetAll(PaginationParams pagination, UserFilterParams filter)
    {
        UserRole? role = null;
        if (!string.IsNullOrEmpty(filter.Role))
        {
            if (!Enum.TryParse<UserRole>(filter.Role, true, out var parsedRole))
                throw new Exception("Invalid role filter.");
            role = parsedRole;
        }

        var response = await _userRepository.GetAll(pagination.Page, pagination.PageSize, role, filter.Search);
        var data = response.Data.Select(user => new UserDto(user)).ToList();
        return new PaginatedList<UserDto>(data, response.TotalData, response.PageNumber, response.PageSize, response.TotalPages);
    }

    public async Task<UserDto> GetById(int id)
    {
        var user = await _userRepository.GetById(id) ?? throw new NotFoundException("user not found");
        return new UserDto(user);
    }

    public async Task Create(RegisterRequest registerRequest)
    {
        var existingUser = await _userRepository.IsEmailOrDniTakenAsync(registerRequest.Email, registerRequest.Dni);
        if (existingUser) throw new AlreadyRegisteredException("Email or Dni are already registered.");

        var randomBytes = RandomNumberGenerator.GetBytes(32);
        var confirmationToken = Convert.ToHexString(randomBytes);

        User user = new();
        user.AuthProvider = AuthProvider.Local;
        user.Email = registerRequest.Email;
        user.Dni = registerRequest.Dni;
        user.Role = registerRequest.Role;
        user.Genre = registerRequest.Genre;
        user.Name = registerRequest.Name;
        user.Password = new PasswordHasher<User>().HashPassword(user, registerRequest.Password);
        user.CreatedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
        user.AccountStatus = AccountStatus.Active;
        user.EmailConfirmationToken = confirmationToken;
        user.EmailConfirmationTokenExpiresAt = DateTime.UtcNow.AddHours(24);

        await _userRepository.Create(user);

        string subject = "Confirmá tu cuenta - Rodaxi";
        string confirmationUrl = $"http://localhost:5173/confirm-email?token={confirmationToken}";
        string body = $@"            
            <html>            
            <body style=""font-family: Arial, sans-serif; color: #333;"">
              <h2 style=""color: #FFD700;"">Confirmá tu cuenta en Roditaxi</h2>
              <p>Gracias por registrarte en <strong>Roditaxi</strong>.</p>
              <p>Para activar tu cuenta, hacé clic en el siguiente botón:</p>
              <p>
                <a href=""{{confirmationUrl}}"" style=""
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #FFD700;
                  color: #000;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;"">
                  Confirmar cuenta
                </a>
              </p>
              <p>O copiá y pegá este enlace en tu navegador:</p>
              <p><a href=""{{confirmationUrl}}"" style=""color: #0000EE; text-decoration: underline;"">{{confirmationUrl}}</a></p>
              <hr>
              <p style=""font-size: 12px; color: #666;"">Si no creaste esta cuenta, podés ignorar este mensaje.</p>
            </body>
            </html>";

        _mailService.Send(subject, body, user.Email);     
    }

    public async Task Create(GithubUserDto userData)
    {
        var existingUser = await _userRepository.GetByEmail(userData.Email);
        if (existingUser is not null) throw new AlreadyRegisteredException("Email already registered.");

        if (userData.Name == null) throw new ConflictException("The GitHub Account doesn't have Name");

        User user = new();
        user.AuthProvider = AuthProvider.Github;
        user.GithubId = userData.Id;
        user.Email = userData.Email;
        user.Name = userData.Name;
        user.CreatedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
        user.AccountStatus = AccountStatus.Pending;
        user.IsEmailConfirmed = true;
        await _userRepository.Create(user);
    }

    public async Task CompleteAccount(CompleteAccountRequest completeAccountRequest, int userId)
    {
        User user = await _userRepository.GetById(userId) ?? throw new NotFoundException("user not found");
        if (user.AccountStatus != AccountStatus.Pending) throw new Exception("user status is not pending");
        var existingDni = await _userRepository.GetByDni(completeAccountRequest.Dni);
        if (existingDni is not null) throw new AlreadyRegisteredException("DNI already registered.");
        user.Dni = completeAccountRequest.Dni;
        user.Genre = completeAccountRequest.Genre;
        user.Role = completeAccountRequest.Role;
        user.AccountStatus = AccountStatus.Active;
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task ChangePassword(ChangePasswordRequest changePasswordRequest, int userId)
    {
        User user = await _userRepository.GetById(userId) ?? throw new NotFoundException("user not found");

        var result = new PasswordHasher<User>().VerifyHashedPassword(user, user.Password, changePasswordRequest.OldPassword);
        if (result != PasswordVerificationResult.Success) throw new NotFoundException("Old password is invalid");

        user.Password = new PasswordHasher<User>().HashPassword(user, changePasswordRequest.NewPassword);
        _userRepository.Update(user);

        await _unitOfWork.SaveChangesAsync();

        string subject = "Tu contraseña fue cambiada correctamente - Rodaxi";
        string body = $@"
             <html>
                <body style=""font-family: Arial, sans-serif; color: #333;"">
                  <h2 style=""color: #FFD700;"">Contraseña actualizada</h2>
                  <p>Te informamos que la contraseña de tu cuenta en <strong>Roditaxi</strong> fue cambiada exitosamente.</p>

                  <p>Si realizaste este cambio, no necesitás hacer nada más.</p>

                  <p>Si no reconocés esta actividad, te recomendamos cambiar tu contraseña lo antes posible desde la aplicación.</p>

                  <hr>
                  <p style=""font-size: 12px; color: #666;"">Este mensaje se generó automáticamente. Si tenés alguna duda, contactá con el soporte de Roditaxi.</p>
                </body>
               </html>";

        _mailService.Send(subject, body, user.Email);  
    }
    
    public async Task<UserDto> Update(UserUpdateRequest request, int authUserId, int paramUserId)
    {
        var user = await _userRepository.GetById(paramUserId);

        if (user == null) throw new NotFoundException("user not found");

        var authUser = authUserId != paramUserId ? await _userRepository.GetById(authUserId) : user;        

        if(authUser.Id != paramUserId && authUser.Role != UserRole.Admin)        
            throw new ForbiddenAccessException("You do not have access to this user.");

        user.Name = request.Name;
        user.Email = request.Email;
        user.Dni = request.Dni;
        user.Genre = request.Genre;

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
        return new UserDto(user);
    }

    public async Task ChangeStatus(int authUserId, int paramUserId)
    {
        var authUser = await _userRepository.GetById(authUserId);
        var user = await _userRepository.GetById(paramUserId);

        if (user == null || authUser == null) throw new NotFoundException("user not found");
        if (authUser.Role != UserRole.Admin) throw new ForbiddenAccessException("You do not have access to this user.");
        if (user.AccountStatus == AccountStatus.Deleted)
            throw new ForbiddenAccessException("Cannot change status of a deleted account.");

        user.AccountStatus = user.AccountStatus != AccountStatus.Active ? AccountStatus.Active : AccountStatus.Disabled;

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAccount(int userId, ValidateUserRequest request)
    {
        var user = await _userRepository.GetById(userId);
        if (user == null) throw new NotFoundException("user not found");

        var result = new PasswordHasher<User>().VerifyHashedPassword(user, user.Password, request.Password);
        if (result != PasswordVerificationResult.Success) throw new NotFoundException("Password is invalid");

        user.IsDeletionScheduled = true;
        user.DeletionScheduledAt = DateTime.UtcNow.AddMinutes(5);

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        string subject = "Tu cuenta será eliminada en 14 días - Rodaxi";
        string body = $@"
             <html>
                <body style=""font-family: Arial, sans-serif; color: #333;"">
                <h2 style=""color: #FFD700;"">Confirmación de eliminación de cuenta</h2>
                <p>Hola,</p>
                <p>Recibimos una solicitud para eliminar tu cuenta en <strong>Roditaxi</strong>.</p>
                <p>Tu cuenta será eliminada <strong>en 14 días</strong> a partir de hoy, a menos que ingreses antes para cancelar este proceso.</p>
                <p>Si deseas conservar tu cuenta, por favor haz clic en el siguiente enlace para acceder y cancelar la eliminación:</p>
                <p>
                    <a href=""http://localhost:5173/login"" 
                        style=""
                        background-color: #FFD700; 
                        color: #000; 
                        text-decoration: none; 
                        padding: 10px 20px; 
                        border-radius: 4px;
                        font-weight: bold;
                        display: inline-block;"">
                    Cancelar eliminación de cuenta
                    </a>
                </p>
                <p>Si no realizaste esta solicitud, puedes ignorar este correo y tu cuenta será eliminada automáticamente.</p>
                <p>Saludos,<br/>El equipo de Roditaxi</p>
                </body>
               </html>";

        _mailService.Send(subject, body, user.Email);
    }

    public async Task ForgotPassword(string email)
    {
        var user = await _userRepository.GetByEmail(email);

        if (user is null) return;


        var randomBytes = RandomNumberGenerator.GetBytes(32);
        var resetToken = Convert.ToHexString(randomBytes);

        user.PasswordResetToken = resetToken;
        user.PasswordResetTokenExpiresAt = DateTime.UtcNow.AddMinutes(15);

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        string subject = "Restablecé tu contraseña - Rodaxi";
        string resetUrl = $"https://localhost:5173/reset-password?token={resetToken}";
        string body = $@"            
            <html>            
            <body style=""font-family: Arial, sans-serif; color: #333;"">
              <h2 style=""color: #FFD700;"">Solicitud para restablecer tu contraseña</h2>
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Roditaxi</strong>.</p>
              <p>Para continuar, hacé clic en el siguiente botón:</p>
              <p>
                <a href=""{{resetUrl}}"" style=""
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #FFD700;
                  color: #000;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;"">
                  Restablecer contraseña
                </a>
              </p>
              <p>O copiá y pegá este enlace en tu navegador:</p>
              <p><a href=""{{resetUrl}}"" style=""color: #0000EE; text-decoration: underline;"">{{resetUrl}}</a></p>
              <hr>
              <p style=""font-size: 12px; color: #666;"">Si vos no pediste este cambio, podés ignorar este mensaje.</p>
            </body>
            </html>";

        _mailService.Send(subject, body, user.Email);
    }

    public async Task ResetPassword(string token, string newPassword)
    {
        var user = await _userRepository.GetByResetPasswordToken(token) ?? throw new NotFoundException("The token is invalid or has expired");
        if (user.PasswordResetTokenExpiresAt < DateTime.UtcNow) throw new NotFoundException("The token is invalid or has expired");

        user.Password = new PasswordHasher<User>().HashPassword(user, newPassword);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiresAt = null;

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        string subject = "Tu contraseña fue cambiada correctamente - Rodaxi";
        string body = $@"
             <html>
                <body style=""font-family: Arial, sans-serif; color: #333;"">
                  <h2 style=""color: #FFD700;"">Contraseña actualizada</h2>
                  <p>Te informamos que la contraseña de tu cuenta en <strong>Roditaxi</strong> fue cambiada exitosamente.</p>

                  <p>Si realizaste este cambio, no necesitás hacer nada más.</p>

                  <p>Si no reconocés esta actividad, te recomendamos cambiar tu contraseña lo antes posible desde la aplicación.</p>

                  <hr>
                  <p style=""font-size: 12px; color: #666;"">Este mensaje se generó automáticamente. Si tenés alguna duda, contactá con el soporte de Roditaxi.</p>
                </body>
               </html>";

        _mailService.Send(subject, body, user.Email);
    }

    public async Task ResendVerificationEmail(string email)
    {
        var user = await _userRepository.GetByEmail(email) ?? throw new NotFoundException("User not found");

        if (user.IsEmailConfirmed)
            throw new ConflictException("Email is already verified");

        var randomBytes = RandomNumberGenerator.GetBytes(32);
        var confirmationToken = Convert.ToHexString(randomBytes);

        user.EmailConfirmationToken = confirmationToken;
        user.EmailConfirmationTokenExpiresAt = DateTime.UtcNow.AddHours(24);

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        string subject = "Confirmá tu cuenta - Rodaxi";
        string confirmationUrl = $"http://localhost:5173/confirm-email?token={confirmationToken}";
        string body = $@"
           <html>            
            <body style=""font-family: Arial, sans-serif; color: #333;"">
              <h2 style=""color: #FFD700;"">Confirmá tu cuenta en Roditaxi</h2>
              <p>Gracias por registrarte en <strong>Roditaxi</strong>.</p>
              <p>Para activar tu cuenta, hacé clic en el siguiente botón:</p>
              <p>
                <a href=""{{confirmationUrl}}"" style=""
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #FFD700;
                  color: #000;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;"">
                  Confirmar cuenta
                </a>
              </p>
              <p>O copiá y pegá este enlace en tu navegador:</p>
              <p><a href=""{{confirmationUrl}}"" style=""color: #0000EE; text-decoration: underline;"">{{confirmationUrl}}</a></p>
              <hr>
              <p style=""font-size: 12px; color: #666;"">Si no creaste esta cuenta, podés ignorar este mensaje.</p>
            </body>
            </html>";

        _mailService.Send(subject, body, user.Email);        
    }

    public async Task ConfirmEmail(string token)
    {
        var user = await _userRepository.GetByEmailConfirmationToken(token) ?? throw new NotFoundException("The token is invalid or has expired");
        if (user.EmailConfirmationTokenExpiresAt < DateTime.UtcNow) throw new NotFoundException("The token is invalid or has expired");

        user.IsEmailConfirmed = true;
        user.EmailConfirmationToken = null;
        user.EmailConfirmationTokenExpiresAt = null;

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
    }
}
