using Application.Interfaces;
using MimeKit;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;


namespace Infrastructure.Services;

public class MailService : IMailService
{
    private readonly string _mailFrom;
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpUser;
    private readonly string _smtpPassword;

    public MailService(IConfiguration configuration)
    {
        _mailFrom = configuration["mailSettings:mailFromAddress"];
        _smtpServer = configuration["mailSettings:smtpServer"];
        _smtpPort = int.Parse(configuration["mailSettings:smtpPort"]);
        _smtpUser = configuration["mailSettings:smtpUser"];
        _smtpPassword = configuration["mailSettings:smtpPassword"];
    }

    public void Send(string subject, string message, string mailTo)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("Rodaxi", _mailFrom));
        email.To.Add(new MailboxAddress("", mailTo));
        email.Subject = subject;

        email.Body = new BodyBuilder
        {
            HtmlBody = message
        }.ToMessageBody();

        try
        {
            using (var client = new SmtpClient())
            {
                client.Connect(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                client.Authenticate(_smtpUser, _smtpPassword);
                client.Send(email);
                client.Disconnect(true);
            }
            Console.WriteLine($"Correo enviado desde {_mailFrom} a {mailTo}.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al enviar correo: {ex.Message}");
        }
    }
}
