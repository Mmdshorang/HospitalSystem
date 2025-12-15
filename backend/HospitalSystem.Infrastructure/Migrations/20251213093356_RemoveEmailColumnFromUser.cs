using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveEmailColumnFromUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop index first if it exists
            migrationBuilder.Sql(@"
                DROP INDEX IF EXISTS ""IX_User_Email"";
            ");

            // Drop Email column if it exists
            migrationBuilder.Sql(@"
                ALTER TABLE ""User"" DROP COLUMN IF EXISTS ""Email"";
            ");
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

            migrationBuilder.CreateIndex(
                name: "IX_User_Email",
                table: "User",
                column: "Email");
        }
    }
}
