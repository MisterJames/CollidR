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
        public static MvcHtmlString RegisterCollidRFor<TModel>(this HtmlHelper<TModel> helper, Expression<Func<TModel, int>> expression, bool includeScript = true)
        {
            PropertyInfo propertyInfo = GetPropertyInfoFromExpression(expression);
            
            string entityTypeName = typeof(TModel).FullName;
            object entityIdValue = propertyInfo.GetValue(helper.ViewData.Model);
          

            var htmlString = GetRegiserCollidRHtmlString(helper, includeScript, entityTypeName, entityIdValue);
            return new MvcHtmlString(htmlString);
        }

        /// <summary>
        /// Register CollidR for the current model using the specified property as an entityId
        /// </summary>
        /// <typeparam name="TModel">The model</typeparam>
        /// <param name="helper"></param>
        /// <param name="expression">The entity id property</param>
        /// <param name="includeScript">true to include the required CollidR javascript files; false if the files have been included elsewhere</param>
        /// <returns></returns>
        public static MvcHtmlString RegisterCollidRFor<TModel>(this HtmlHelper<TModel> helper, Expression<Func<TModel, string>> expression, bool includeScript = true)
        {
            PropertyInfo propertyInfo = GetPropertyInfoFromExpression(expression);

            string entityTypeName = typeof(TModel).FullName;
            object entityIdValue = propertyInfo.GetValue(helper.ViewData.Model);


            var htmlString = GetRegiserCollidRHtmlString(helper, includeScript, entityTypeName, entityIdValue);
            return new MvcHtmlString(htmlString);
        }

        /// <summary>
        /// Register CollidR for the current model using the specified property as an entityId
        /// </summary>
        /// <typeparam name="TModel">The model</typeparam>
        /// <param name="helper"></param>
        /// <param name="expression">The entity id property</param>
        /// <param name="includeScript">true to include the required CollidR javascript files; false if the files have been included elsewhere</param>
        /// <returns></returns>
        public static MvcHtmlString RegisterCollidRFor<TModel>(this HtmlHelper<TModel> helper, Expression<Func<TModel, Guid>> expression, bool includeScript = true)
        {
            PropertyInfo propertyInfo = GetPropertyInfoFromExpression(expression);

            string entityTypeName = typeof(TModel).FullName;
            object entityIdValue = propertyInfo.GetValue(helper.ViewData.Model);
            
            var htmlString = GetRegiserCollidRHtmlString(helper, includeScript, entityTypeName, entityIdValue);
            return new MvcHtmlString(htmlString);
        }

        /// <summary>
        /// Register CollidR for the current model using the specified property as an entityId
        /// </summary>
        /// <typeparam name="TModel">The model</typeparam>
        /// <param name="helper"></param>
        /// <param name="expression">The entity id property</param>
        /// <param name="includeScript">true to include the required CollidR javascript files; false if the files have been included elsewhere</param>
        /// <returns></returns>
        public static MvcHtmlString RegisterCollidRFor<TModel>(this HtmlHelper<TModel> helper, Expression<Func<TModel, long>> expression, bool includeScript = true)
        {
            PropertyInfo propertyInfo = GetPropertyInfoFromExpression(expression);

            string entityTypeName = typeof(TModel).FullName;
            object entityIdValue = propertyInfo.GetValue(helper.ViewData.Model);


            var htmlString = GetRegiserCollidRHtmlString(helper, includeScript, entityTypeName, entityIdValue);
            return new MvcHtmlString(htmlString);
        }

        private static string GetRegiserCollidRHtmlString<TModel>(HtmlHelper<TModel> helper, bool includeScript, string entityTypeName, object entityIdValue)
        {
            StringBuilder scriptBuilder = new StringBuilder();
            if (includeScript)
            {
                UrlHelper urlHelper = new UrlHelper(helper.ViewContext.RequestContext);
                scriptBuilder.AppendFormat("<script src='{0}'></script>", urlHelper.Content("~/Scripts/CollidR.js"));
            }

            scriptBuilder.AppendLine(@"<script type='text/javascript'>");
            scriptBuilder.AppendLine(@"new $.collidR(");
            scriptBuilder.AppendLine("{");

            scriptBuilder.AppendFormat("entityType: '{0}',", entityTypeName);
            scriptBuilder.AppendLine();

            scriptBuilder.AppendFormat("entityId: '{0}'", entityIdValue);
            scriptBuilder.AppendLine();
            scriptBuilder.AppendLine("})");
            scriptBuilder.AppendLine(".registerClient();");

            scriptBuilder.Append(@"</script>");
            string htmlString = scriptBuilder.ToString();
            return htmlString;
        }

        public static MvcHtmlString CollidREditorPane(this HtmlHelper helper)
        {
            StringBuilder scriptBuilder = new StringBuilder();

            scriptBuilder.AppendLine("<div class='alert alert-success' data-collidr='editorsPane'>");
            scriptBuilder.AppendLine("    <span data-collidr='editorsList'></span>");
            scriptBuilder.AppendLine("</div>");

            var htmlString = scriptBuilder.ToString();
            return new MvcHtmlString(htmlString);
        }

        private static PropertyInfo GetPropertyInfoFromExpression<T, T2>(Expression<Func<T, T2>> expression)
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