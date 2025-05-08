using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Models;

public class GithubUserDto
{
    public long Id { get; set; }
    public string Login { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }

    [JsonPropertyName("avatar_url")]
    public string AvatarUrl { get; set; }
}

public class GithubEmailDto
{
    public string Email { get; set; }
    public bool Primary { get; set; }
    public bool Verified { get; set; }
}