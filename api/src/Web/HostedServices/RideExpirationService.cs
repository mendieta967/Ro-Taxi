
using Application.Interfaces;
using Domain.Interfaces;

namespace Web.HostedServices;

public class RideExpirationService: BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<RideExpirationService> _logger;

    public RideExpirationService(IServiceScopeFactory scopeFactory, ILogger<RideExpirationService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Ride Expiration Service started");
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var rideRepository = scope.ServiceProvider.GetRequiredService<IRideRepository>();
                var expiredCount = await rideRepository.ExpireRides(stoppingToken);
                if (expiredCount > 0)
                    _logger.LogInformation($"Expired {expiredCount} rides.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error expiring scheduled rides");
            }
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
