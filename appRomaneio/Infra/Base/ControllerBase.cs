namespace Infra.Base.Interface.Base
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Web.Http;
    
    public abstract class ControllerBase : ApiController
    {
        public Context db = new Context();

        protected T MarcarGrafoComoAdded<T>(T raiz) where T : class
        {
            db.Entry(raiz).State = EntityState.Added;
            return raiz;
        }

        protected T MarcarEntidadeComoModified<T>(T entidade) where T : class
        {
            db.Entry(entidade).State = EntityState.Modified;
            return entidade;
        }        
    }
}
