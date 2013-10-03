using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace CollidR.Mvc
{
    public static class CollidRHelpers
    {
        public static MvcHtmlString RegisterCollidR<TModel>(this HtmlHelper<TModel> helper, Expression<Func<TModel, int>> expression)
        {
            PropertyInfo propertyInfo = GetPropertyInfoFromExpression(expression);
            StringBuilder scriptBuilder = new StringBuilder();

            scriptBuilder.AppendLine(@"<script type='text/javascript'>");
            scriptBuilder.AppendLine(@"var collidR = new $.collidR(");
            scriptBuilder.AppendLine("{");
            scriptBuilder.AppendFormat("entityType: '{0}',", typeof(TModel).FullName);
            scriptBuilder.AppendLine();
            scriptBuilder.AppendFormat("entityId: {0}", propertyInfo.GetValue(helper.ViewData.Model));
            scriptBuilder.AppendLine();
            scriptBuilder.AppendLine("})");
            scriptBuilder.AppendLine(".registerClient();");

            scriptBuilder.Append(@"</script>");
            return new MvcHtmlString(scriptBuilder.ToString());
        }

        private static PropertyInfo GetPropertyInfoFromExpression<T>(Expression<Func<T, int>> expression)
        {
            MemberExpression member = expression.Body as MemberExpression;
            if (member == null)
            {
                throw new ArgumentException(string.Format("Expression '{0}' refers to a method instead of a property.", expression));
            }

            return member.Member as PropertyInfo;

        }
    }
}