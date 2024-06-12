using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Event_Planning_System.Migrations
{
    /// <inheritdoc />
    public partial class updateMigrationBudgetTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Budgets_BudgetId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AbpUsers_UserId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_ToDoChecks_AbpUsers_UserId",
                table: "ToDoChecks");

            migrationBuilder.DropIndex(
                name: "IX_Events_BudgetId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "BudgetId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Budgets");

            migrationBuilder.AddColumn<long>(
                name: "GuestId",
                table: "Notifications",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<bool>(
                name: "isRead",
                table: "Notifications",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "status",
                table: "Notifications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "Budgets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Budgets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_GuestId",
                table: "Notifications",
                column: "GuestId");

            migrationBuilder.CreateIndex(
                name: "IX_Budgets_EventId",
                table: "Budgets",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Budgets_Events_EventId",
                table: "Budgets",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AbpUsers_GuestId",
                table: "Notifications",
                column: "GuestId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AbpUsers_UserId",
                table: "Notifications",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ToDoChecks_AbpUsers_UserId",
                table: "ToDoChecks",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Budgets_Events_EventId",
                table: "Budgets");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AbpUsers_GuestId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AbpUsers_UserId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_ToDoChecks_AbpUsers_UserId",
                table: "ToDoChecks");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_GuestId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Budgets_EventId",
                table: "Budgets");

            migrationBuilder.DropColumn(
                name: "GuestId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "isRead",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "status",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "Budgets");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Budgets");

            migrationBuilder.AddColumn<int>(
                name: "BudgetId",
                table: "Events",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Budgets",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Events_BudgetId",
                table: "Events",
                column: "BudgetId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Budgets_BudgetId",
                table: "Events",
                column: "BudgetId",
                principalTable: "Budgets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AbpUsers_UserId",
                table: "Notifications",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ToDoChecks_AbpUsers_UserId",
                table: "ToDoChecks",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
