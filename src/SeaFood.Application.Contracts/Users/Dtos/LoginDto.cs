using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Users.Dtos
{
    public class LoginDto
    {
        public string UserNameOrPhoneNumber { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; } = true;
    }
}
