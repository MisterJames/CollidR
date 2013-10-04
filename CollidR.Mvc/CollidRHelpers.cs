using System;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Web.Mvc;

namespace CollidR.Mvc
{
    public static class CollidRHelpers
    {
        /// <summary>
        /// Register CollidR for the current model using the specified property as an entityId
        /// </summary>
        /// <typeparam name="TModel">The model</typeparam>
        /// <param name="helper"></param>
        /// <param name="expression">The entity id property</param>
        /// <param name="includeScript">true to include the required CollidR javascript files; false if the files have been included elsewhere</param>
        /// <returns></returns>
        public static MvcHtmlString RegisterCollidR<TModel>(this HtmlHelper<TModel> helper, Expression<Func<TModel, int>> expression, bool includeScript = true)
        {
            PropertyInfo propertyInfo = GetPropertyInfoFromExpression(expression);
            StringBuilder scriptBuilder = new StringBuilder();
        
            if (includeScript)
            {
                UrlHelper urlHelper = new UrlHelper(helper.ViewContext.RequestContext);
                scriptBuilder.AppendFormat("<script src='{0}'></script>", urlHelper.Content("~/Scripts/CollidR.js"));
            }
          
            scriptBuilder.AppendLine(@"<script type='text/javascript'>");
            scriptBuilder.AppendLine(@"new $.collidR(");
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