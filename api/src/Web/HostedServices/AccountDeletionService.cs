using Domain.Interfaces;

namespace Web.HostedServices;

public class AccountDeletionService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AccountDeletionService> _logger;

    public AccountDeletionService(IServiceScopeFactory scopeFactory, ILogger<AccountDeletionService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Account Deletion Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                
                var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();

                var deletedCount = await userRepository.DeleteAccount(stoppingToken);

                if (deletedCount > 0)
                    _logger.LogInformation($"Deleted {deletedCount} accounts.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting scheduled accounts");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
