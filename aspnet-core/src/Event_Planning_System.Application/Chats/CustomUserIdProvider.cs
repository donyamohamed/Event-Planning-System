using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System;
using System.Security.Claims;

public class CustomUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        // Print claims for debugging
        foreach (var claim in connection.User?.Claims ?? Enumerable.Empty<Claim>())
        {
            Console.WriteLine($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
        }

        // Return user ID from claims
        return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}
