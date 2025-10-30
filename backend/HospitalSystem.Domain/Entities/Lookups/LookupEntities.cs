namespace HospitalSystem.Domain.Entities.Lookups
{
    public class Gender 
    { 
        public short Id { get; set; } 
        public string GenderName { get; set; } = null!; 
    }

    public class AppointmentType 
    { 
        public short Id { get; set; } 
        public string TypeName { get; set; } = null!; 
    }

    public class RequestStatus 
    { 
        public short Id { get; set; } 
        public string StatusName { get; set; } = null!; 
    }

    public class PaymentMethod 
    { 
        public short Id { get; set; } 
        public string MethodName { get; set; } = null!; 
    }

    public class PaymentStatus 
    { 
        public short Id { get; set; } 
        public string StatusName { get; set; } = null!; 
    }

    public class NotificationType 
    { 
        public short Id { get; set; } 
        public string TypeName { get; set; } = null!; 
    }

    public class WeekDay 
    { 
        public short Id { get; set; } 
        public string Label { get; set; } = null!; 
    }
}