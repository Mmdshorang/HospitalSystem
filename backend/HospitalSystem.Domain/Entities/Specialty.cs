namespace HospitalSystem.Domain.Entities
{
    public class SpecialtyCategory
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<Specialty>? Specialties { get; set; }
    }

    public class Specialty
    {
        public long Id { get; set; }
        public long? CategoryId { get; set; }
        public SpecialtyCategory? Category { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}