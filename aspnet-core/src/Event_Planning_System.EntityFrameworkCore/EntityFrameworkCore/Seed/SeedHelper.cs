﻿using System;
using System.Transactions;
using Microsoft.EntityFrameworkCore;
using Abp.Dependency;
using Abp.Domain.Uow;
using Abp.EntityFrameworkCore.Uow;
using Abp.MultiTenancy;
using Event_Planning_System.EntityFrameworkCore.Seed.Host;
using Event_Planning_System.EntityFrameworkCore.Seed.Tenants;
using Event_Planning_System.Enitities;
using System.Linq;

namespace Event_Planning_System.EntityFrameworkCore.Seed
{
    public static class SeedHelper
    {
        public static void SeedHostDb(IIocResolver iocResolver)
        {
            WithDbContext<Event_Planning_SystemDbContext>(iocResolver, SeedHostDb);
        }

        public static void SeedHostDb(Event_Planning_SystemDbContext context)
        {
            context.SuppressAutoSetTenantId = true;

            // Host seed
            new InitialHostDbBuilder(context).Create();

            // Default tenant seed (in host database).
            new DefaultTenantBuilder(context).Create();
            new TenantRoleAndUserBuilder(context, 1).Create();
            // seed intersts
            SeedInterests(context);
        }

        private static void WithDbContext<TDbContext>(IIocResolver iocResolver, Action<TDbContext> contextAction)
            where TDbContext : DbContext
        {
            using (var uowManager = iocResolver.ResolveAsDisposable<IUnitOfWorkManager>())
            {
                using (var uow = uowManager.Object.Begin(TransactionScopeOption.Suppress))
                {
                    var context = uowManager.Object.Current.GetDbContext<TDbContext>(MultiTenancySides.Host);

                    contextAction(context);

                    uow.Complete();
                }
            }
        }

        private static void SeedInterests(Event_Planning_SystemDbContext context)
        {
            if (!context.interests.Any())
            {
                foreach (EventCategory category in Enum.GetValues(typeof(EventCategory)))
                {
                    context.interests.Add(new Interest { Type = category });
                }
                context.SaveChanges();
            }
        }
    }
}
