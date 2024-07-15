using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Event_Planning_System.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGuestEventTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GuestEvent_Events_EventId",
                table: "GuestEvent");

            migrationBuilder.DropForeignKey(
                name: "FK_GuestEvent_Guests_GuestId",
                table: "GuestEvent");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GuestEvent",
                table: "GuestEvent");

            migrationBuilder.RenameTable(
                name: "GuestEvent",
                newName: "GuestEvents");

            migrationBuilder.RenameIndex(
                name: "IX_GuestEvent_EventId",
                table: "GuestEvents",
                newName: "IX_GuestEvents_EventId");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "GuestEvents",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuestEvents",
                table: "GuestEvents",
                columns: new[] { "GuestId", "EventId" });

            migrationBuilder.AddForeignKey(
                name: "FK_GuestEvents_Events_EventId",
                table: "GuestEvents",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GuestEvents_Guests_GuestId",
                table: "GuestEvents",
                column: "GuestId",
                principalTable: "Guests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GuestEvents_Events_EventId",
                table: "GuestEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_GuestEvents_Guests_GuestId",
                table: "GuestEvents");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GuestEvents",
                table: "GuestEvents");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "GuestEvents");

            migrationBuilder.RenameTable(
                name: "GuestEvents",
                newName: "GuestEvent");

            migrationBuilder.RenameIndex(
                name: "IX_GuestEvents_EventId",
                table: "GuestEvent",
                newName: "IX_GuestEvent_EventId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuestEvent",
                table: "GuestEvent",
                columns: new[] { "GuestId", "EventId" });

            migrationBuilder.AddForeignKey(
                name: "FK_GuestEvent_Events_EventId",
                table: "GuestEvent",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GuestEvent_Guests_GuestId",
                table: "GuestEvent",
                column: "GuestId",
                principalTable: "Guests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
