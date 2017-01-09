
namespace Infra.Base
{
    using System.Net;
    using System.Net.Http;
    using System.Web.Http.Filters;

    public class ExceptionAttribute : ExceptionFilterAttribute
    {

        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            //if (actionExecutedContext.Exception != null)
            //    Elmah.ErrorSignal.FromCurrentContext().Raise(actionExecutedContext.Exception);

            // http://weblogs.asp.net/fredriknormen/asp-net-web-api-exception-handling
            //if (actionExecutedContext.Exception is BusinessException)
            //{
            //    actionExecutedContext.Response = new HttpResponseMessage(HttpStatusCode.BadRequest)
            //    {
            //        Content = new StringContent(actionExecutedContext.Exception.Message)
            //    };
            //}
            //else
            //{
            //    actionExecutedContext.Response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
            //}
            //ServicoDeLog.Log("ROLLBACK");

            actionExecutedContext.Response = new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                Content = new StringContent(actionExecutedContext.Exception.Message)
            };

        }
    }

}