// --------------------------------------------------------------------------------------------------------------------
// <copyright file="DefaultRouteHandler.cs" company="">
//   Copyright © 2014 
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace appRomaneio.Angular
{
    using System;
    using System.Web;
    using System.Web.Routing;
    using System.Web.WebPages;

    public class DefaultRouteHandler : IRouteHandler
    {
        public IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            // Use cases:
            //     ~/            -> ~/views/index.html
            //     ~/about       -> ~/views/about.html or ~/views/about/index.html
            //     ~/views/about -> ~/views/about.html
            //     ~/xxx         -> ~/views/404.html
            var filePath = requestContext.HttpContext.Request.AppRelativeCurrentExecutionFilePath;

            if (filePath == "~/")
            {
                filePath = "~/views/index.html";
            }
            else
            {
                if (!filePath.StartsWith("~/views/", StringComparison.OrdinalIgnoreCase))
                {
                    filePath = filePath.Insert(2, "views/");
                }

                if (!filePath.EndsWith(".html", StringComparison.OrdinalIgnoreCase))
                {
                    filePath = filePath += ".html";
                }
            }

            var handler = WebPageHttpHandler.CreateFromVirtualPath(filePath); // returns NULL if .html file wasn't found

            if (handler == null)
            {
                // case a página requisitada não exista (partial html ou 404), retornar o index e deixar a SPA tratar roteamento
                requestContext.RouteData.DataTokens.Add("templateUrl", "/views/index");
                handler = WebPageHttpHandler.CreateFromVirtualPath("~/views/index.html");
            }
            else
            {
                requestContext.RouteData.DataTokens.Add("templateUrl", filePath.Substring(2));
            }

            return handler;
        }
    }
}
