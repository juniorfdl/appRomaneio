
namespace Infra.Base.Interface.Base
{
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Reflection;

    public static class QueryableExtensions
    {
        public static IQueryable<TProjecao> OrderBy<TProjecao>(this IQueryable<TProjecao> source, string ordering, bool asc = true)
        {
            var type = typeof(TProjecao);
            var property = type.GetProperty(ordering, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);
            if (property.PropertyType.IsInterface)
            {
                throw new InvalidOperationException(string.Format("Não é possível classificar pelo campo '{0}'", ordering));
            }
            var parameter = Expression.Parameter(type, "p");
            var propertyAccess = Expression.MakeMemberAccess(parameter, property);
            var orderByExp = Expression.Lambda(propertyAccess, parameter);
            MethodCallExpression resultExp = Expression.Call(typeof(Queryable),
                asc ? "OrderBy" : "OrderByDescending",
                new Type[] { type, property.PropertyType },
                source.Expression,
                Expression.Quote(orderByExp));
            return source.Provider.CreateQuery<TProjecao>(resultExp);
        }
    }
}
