using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeaFood.Migrations
{
    /// <inheritdoc />
    public partial class Update_Category_Entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "ExtraProperties",
                table: "Category");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            
        }
    }
}
