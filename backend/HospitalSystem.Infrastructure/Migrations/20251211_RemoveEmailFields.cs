using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveEmailFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop email columns if they still exist
            migrationBuilder.Sql("ALTER TABLE \"User\" DROP COLUMN IF EXISTS \"Email\";");
            migrationBuilder.Sql("ALTER TABLE \"Clinics\" DROP COLUMN IF EXISTS \"Email\";");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "User",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Clinics",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }
    }
}
