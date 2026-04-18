using SeaFood.Entities.ContactRequests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.ContactRequests.Dtos
{
    public class ContactRequestDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public ContactProductType InterestedProduct { get; set; }
        public ContactInquiryType InquiryType { get; set; }
        public string Message { get; set; }
        public ContactRequestStatus Status { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
