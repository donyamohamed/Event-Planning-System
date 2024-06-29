using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Event_Planning_System.Migrations
{
	/// <inheritdoc />
	public partial class Add : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropForeignKey(
				name: "FK_Budgets_Events_EventId",
				table: "Budgets");

			migrationBuilder.DropForeignKey(
				name: "FK_ToDoChecks_Events_EventId",
				table: "ToDoChecks");

			migrationBuilder.DropPrimaryKey(
				name: "PK_ChatMessage",
				table: "ChatMessage");

			migrationBuilder.RenameTable(
				name: "ChatMessage",
				newName: "ChatMessages");

			migrationBuilder.AddColumn<bool>(
				name: "IsReviewTaken",
				table: "Notifications",
				type: "bit",
				nullable: false,
				defaultValue: false);

			migrationBuilder.AddPrimaryKey(
				name: "PK_ChatMessages",
				table: "ChatMessages",
				column: "Id");

			migrationBuilder.CreateTable(
				name: "Feedbacks",
				columns: table => new
				{
					Id = table.Column<int>(type: "int", nullable: false)
						.Annotation("SqlServer:Identity", "1, 1"),
					Body = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
					EventId = table.Column<int>(type: "int", nullable: false),
					UserId = table.Column<long>(type: "bigint", nullable: false),
					Rate = table.Column<float>(type: "real", nullable: false),
					DateTime = table.Column<DateTime>(type: "datetime2", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Feedbacks", x => x.Id);
					table.ForeignKey(
						name: "FK_Feedbacks_AbpUsers_UserId",
						column: x => x.UserId,
						principalTable: "AbpUsers",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
					table.ForeignKey(
						name: "FK_Feedbacks_Events_EventId",
						column: x => x.EventId,
						principalTable: "Events",
						principalColumn: "Id",
						onDelete: ReferentialAction.Restrict); // Changed from Cascade to Restrict
				});

			migrationBuilder.CreateTable(
				name: "GuestEvent",
				columns: table => new
				{
					GuestId = table.Column<int>(type: "int", nullable: false),
					EventId = table.Column<int>(type: "int", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_GuestEvent", x => new { x.GuestId, x.EventId });
					table.ForeignKey(
						name: "FK_GuestEvent_Events_EventId",
						column: x => x.EventId,
						principalTable: "Events",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
					table.ForeignKey(
						name: "FK_GuestEvent_Guests_GuestId",
						column: x => x.GuestId,
						principalTable: "Guests",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateIndex(
				name: "IX_AbpUsers_EmailAddress",
				table: "AbpUsers",
				column: "EmailAddress",
				unique: true);

			migrationBuilder.CreateIndex(
				name: "IX_Feedbacks_EventId_UserId",
				table: "Feedbacks",
				columns: new[] { "EventId", "UserId" },
				unique: true);

			migrationBuilder.CreateIndex(
				name: "IX_Feedbacks_UserId",
				table: "Feedbacks",
				column: "UserId");

			migrationBuilder.CreateIndex(
				name: "IX_GuestEvent_EventId",
				table: "GuestEvent",
				column: "EventId");

			migrationBuilder.AddForeignKey(
				name: "FK_Budgets_Events_EventId",
				table: "Budgets",
				column: "EventId",
				principalTable: "Events",
				principalColumn: "Id",
				onDelete: ReferentialAction.NoAction);

			migrationBuilder.AddForeignKey(
				name: "FK_ToDoChecks_Events_EventId",
				table: "ToDoChecks",
				column: "EventId",
				principalTable: "Events",
				principalColumn: "Id",
				onDelete: ReferentialAction.Cascade);
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropForeignKey(
				name: "FK_Budgets_Events_EventId",
				table: "Budgets");

			migrationBuilder.DropForeignKey(
				name: "FK_ToDoChecks_Events_EventId",
				table: "ToDoChecks");

			migrationBuilder.DropTable(
				name: "Feedbacks");

			migrationBuilder.DropTable(
				name: "GuestEvent");

			migrationBuilder.DropIndex(
				name: "IX_AbpUsers_EmailAddress",
				table: "AbpUsers");

			migrationBuilder.DropPrimaryKey(
				name: "PK_ChatMessages",
				table: "ChatMessages");

			migrationBuilder.DropColumn(
				name: "IsReviewTaken",
				table: "Notifications");

			migrationBuilder.RenameTable(
				name: "ChatMessages",
				newName: "ChatMessage");

			migrationBuilder.AddPrimaryKey(
				name: "PK_ChatMessage",
				table: "ChatMessage",
				column: "Id");

			migrationBuilder.AddForeignKey(
				name: "FK_Budgets_Events_EventId",
				table: "Budgets",
				column: "EventId",
				principalTable: "Events",
				principalColumn: "Id",
				onDelete: ReferentialAction.Cascade);

			migrationBuilder.AddForeignKey(
				name: "FK_ToDoChecks_Events_EventId",
				table: "ToDoChecks",
				column: "EventId",
				principalTable: "Events",
				principalColumn: "Id",
				onDelete: ReferentialAction.Cascade);
		}
	}
}
