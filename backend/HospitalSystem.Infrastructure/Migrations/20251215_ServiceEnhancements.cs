using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ServiceEnhancements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DeliveryType",
                table: "Services",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "InClinic");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Services",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Services",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<long>(
                name: "ParentServiceId",
                table: "Services",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Services_ParentServiceId",
                table: "Services",
                column: "ParentServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Services_Services_ParentServiceId",
                table: "Services",
                column: "ParentServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Services_Services_ParentServiceId",
                table: "Services");

            migrationBuilder.DropIndex(
                name: "IX_Services_ParentServiceId",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "DeliveryType",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "ParentServiceId",
                table: "Services");
        }
    }
}
