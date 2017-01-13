namespace Infra.Base.Interface.Base
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Core;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Validation;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Net;
    using System.Reflection;
    using System.Text;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Description;
    using Infra.Base;
    using System.Globalization;
    using Models.SIS;
    using System.Web.Http.ModelBinding;
    using System.ComponentModel.DataAnnotations.Schema;

    public abstract class CrudController<T, TProjecao> : ControllerBase, IDisposable
        where T : class, IEntidadeBase
        where TProjecao : T
    {
        protected virtual IQueryable<TProjecao> Filtrar(IQueryable<TProjecao> query, string termoDePesquisa, string campoPesquisa)
        {
            if (string.IsNullOrEmpty(termoDePesquisa) || string.IsNullOrEmpty(campoPesquisa)) return query;

            var parameter = Expression.Parameter(typeof(TProjecao), "p");
            var propertyInfo = typeof(TProjecao).GetProperty(campoPesquisa, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);
            var property = Expression.Property(parameter, propertyInfo);
            Expression body = null;

            var notMapped = typeof(TProjecao).GetProperty(campoPesquisa).GetCustomAttributes(typeof(NotMappedAttribute), false);

            if (notMapped.Length > 0) // testa se o campo é NotMapped, se for não faz where
            {
                return query;
            }


            try
            {
                if (campoPesquisa == "CEMP")
                {
                    body = Expression.Equal(property, Expression.Constant(termoDePesquisa));
                }
                else
                if (propertyInfo.PropertyType == typeof(int))
                {
                    var asInt32 = Convert.ToInt32(termoDePesquisa);
                    body = Expression.Equal(property, Expression.Constant(asInt32));
                }
                else
                if (propertyInfo.PropertyType == typeof(string))
                {
                    body = Expression.Call(property,
                        "Contains",
                        null,
                        Expression.Constant(termoDePesquisa));
                }
                else if (propertyInfo.PropertyType == typeof(DateTime))
                {
                    var asDateTime = Convert.ToDateTime(termoDePesquisa);
                    body = Expression.Equal(property, Expression.Constant(asDateTime));
                }
                else
                if (propertyInfo.PropertyType == typeof(Nullable<int>))
                {
                    // //var myInstance = new myClass();
                    // var equalsMethod = typeof(Int32?).GetMethod("Equals", new[] { typeof(Int32?) });
                    // int? nullableInt = Convert.ToInt32(termoDePesquisa);
                    // var nullableIntExpr = System.Linq.Expressions.Expression.Constant(nullableInt);
                    // //var myInstanceExpr = System.Linq.Expressions.Expression.Constant(myInstance);
                    // var propertyExpr = property;
                    //// body = Expression.Call(propertyExpr, equalsMethod, nullableIntExpr); // This line throws the exception.     

                    // var converted = Expression.Convert(nullableIntExpr, typeof(int?));
                    // body = Expression.Call(propertyExpr, equalsMethod, converted);                    


                }
            }
            catch (FormatException)
            {
                return query.Take(0);
            }
            var filterExp = Expression.Lambda<Func<TProjecao, bool>>(body, parameter);

            return query.Where(filterExp);
        }
        protected virtual IOrderedQueryable<TProjecao> Ordenar(IQueryable<TProjecao> query) { return query.OrderBy(it => it.id); }
        protected virtual IQueryable<T> TrazerDadosParaEdicao(IQueryable<T> query) { return query; }
        protected virtual IQueryable<TProjecao> TrazerDadosParaLista(IQueryable<TProjecao> query) { return query; }

        protected virtual void InternalUpdate(T item) { }

        private IList<Action> _scheduledActions;
        protected void ExecutarAposTransacao(Action action)
        {
            if (_scheduledActions == null) _scheduledActions = new List<Action>();
            _scheduledActions.Add(action);
        }

        protected virtual void ExecutarAntesPost(T item)
        {
        }

        protected virtual void BeforeReturn(T item)
        {
            //if (typeof(IRaizDeAgregacao).IsAssignableFrom(typeof(T)))
            //{
            //    ((IRaizDeAgregacao)item).Flag = null;
            //}
            if (_scheduledActions != null)
            {
                foreach (var acao in _scheduledActions)
                {
                    acao();
                }
                _scheduledActions = null;
            }
        }

        protected virtual void BeforeSaveChanges(T item)
        {
        }

        [NonAction]
        protected virtual void ExecutarMenu() { }

        protected abstract Expression<Func<T, TProjecao>> Selecionar();

        // GET: api/T
        [HttpGet]
        public ResultadoDaBusca<TProjecao> Get(string empresa, string termo = null, string campoOrdenacao = null, bool direcaoAsc = true,
            int pagina = 1, int itensPorPagina = 0, string campoPesquisa = "",
            [FromUri] List<string> filtrosBaseNome = null, [FromUri] List<string> filtrosBaseValor = null)
        {
            var Item = this.Selecionar();

            var queryOriginal = db.Set<T>().AsQueryable().Select(Item);

            if (!string.IsNullOrWhiteSpace(termo))
            {
                queryOriginal = this.Filtrar(queryOriginal, termo, campoPesquisa);
            }

            if (!string.IsNullOrWhiteSpace(empresa))
            {
                var NomeMenu = Item.ReturnType.Name.ToUpper() + ".DLL";
                var MENU = db.Set<SIS_MENU>().Where(b => b.DLL == NomeMenu).FirstOrDefault();

                if (MENU == null || MENU.EMP != "S")
                    queryOriginal = this.Filtrar(queryOriginal, empresa, "CEMP");
            }

            for (var i = 0; i < filtrosBaseNome.Count; i++)
            {
                string valor = filtrosBaseValor[i];
                string nome = filtrosBaseNome[i];


                if (valor != null && filtrosBaseNome[i] != null)
                    queryOriginal = this.Filtrar(queryOriginal, valor, nome);
            }

            var queryRetorno = queryOriginal;
            if (campoOrdenacao != null)
            {
                queryRetorno = queryRetorno.OrderBy(campoOrdenacao, direcaoAsc);
            }
            else
            {
                queryRetorno = this.Ordenar(queryRetorno);
            }

            if (itensPorPagina > 0)
            {
                if (pagina > 1)
                    queryRetorno = queryRetorno.Skip((pagina - 1) * itensPorPagina);
                queryRetorno = queryRetorno.Take(itensPorPagina);
            }


            return new ResultadoDaBusca<TProjecao>
            {
                lista = this.TrazerDadosParaLista(queryRetorno),
                totalCount = queryOriginal.Count()
            };
        }

        //GET: api/T/5
        // TODO: verificar se é possível restrigir IDs para valores numéricos, na rota

        [Route("/{id:int:min(1)}")]
        public IHttpActionResult Get(int id)
        {
            T item = this.TrazerDadosParaEdicao(db.Set<T>()).FirstOrDefault(e => e.id == id);
            if (item == null)
            {
                return NotFound();
            }

            BeforeReturn(item);
            return Ok(item);
        }

        private class ChaveEstrangeira
        {
            public object ObjetoPrincipal { get; set; }
            public string NomePropriedade { get; set; }
            public object ValorOriginal { get; set; }
        }

        private IList<ChaveEstrangeira> EncontrarObjetos(object item)
        {
            var lista = new List<ChaveEstrangeira>();
            var objetosNoGrafo = new Stack<object>();
            objetosNoGrafo.Push(item);

            do
            {
                var principal = objetosNoGrafo.Pop();
                var props = principal.GetType().GetProperties();

                var propsFK = props.Where(p => p.Name.StartsWith("Codigo") && p.PropertyType == typeof(int) && (int)p.GetValue(principal) == 0);
                foreach (var prop in propsFK)
                {
                    lista.Add(new ChaveEstrangeira
                    {
                        ObjetoPrincipal = principal,
                        NomePropriedade = prop.Name,
                        ValorOriginal = prop.GetValue(principal)
                    });
                }

                var propsNavegacao = props.Where(pi => pi.PropertyType.IsInterface || pi.PropertyType.IsClass && pi.PropertyType != typeof(string));
                foreach (var prop in propsNavegacao)
                {

                    object objetoRelacionado = null;

                    try
                    {
                        objetoRelacionado = prop.GetValue(principal);
                    }
                    catch
                    {
                        break;
                    }

                    if (objetoRelacionado != null)
                    {
                        if (objetoRelacionado is IEnumerable)
                        {
                            foreach (var objetoDetalhe in objetoRelacionado as IEnumerable)
                            {
                                objetosNoGrafo.Push(objetoDetalhe);
                            }
                        }
                        else
                        {
                            objetosNoGrafo.Push(objetoRelacionado);
                        }
                    }
                }

            } while (objetosNoGrafo.Any());

            return lista;
        }

        // PUT: api/T/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Put(int id, T item)
        {
            //if (typeof(IRaizDeAgregacao).IsAssignableFrom(typeof(T)))
            //{
            //    ((IRaizDeAgregacao)item).Flag = true;
            //    ModelState["item.Flag"].Errors.Clear();
            //}

            ConfCEMP(item);

            if (!ModelState.IsValid)
            {
                return TestarModelState(ModelState);
            }

            //if (id != item.Id)
            //{
            //return BadRequest();
            //}

            var objetos = EncontrarObjetos(item);

            var colecoes = new Dictionary<PropertyInfo, object>();
            foreach (var prop in typeof(T).GetProperties().Where(pi => typeof(IEnumerable<object>).IsAssignableFrom(pi.PropertyType)))
            {
                colecoes[prop] = prop.GetValue(item);
                prop.SetValue(item, null);
            }
            db.Entry(item).State = EntityState.Modified;
            foreach (var salvo in colecoes)
            {
                salvo.Key.SetValue(item, salvo.Value);
            }

            InternalUpdate(item);

            foreach (var obj in objetos)
            {
                if (db.Entry(obj.ObjetoPrincipal).State == EntityState.Modified)
                {
                    db.Entry(obj.ObjetoPrincipal).State = EntityState.Deleted;
                }
            }

            using (var dbContextTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    BeforeSaveChanges(item);
                    db.SaveChanges();
                    dbContextTransaction.Commit();
                }
                catch (DbUpdateConcurrencyException e)
                {
                    dbContextTransaction.Rollback();
                    if (!ItemExiste(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        var atual = e.Entries.First().GetDatabaseValues();
                        var paraSalvar = db.Entry(item).CurrentValues;
                        var conc = atual.PropertyNames.Where(prop => !atual.GetValue<object>(prop).Equals(paraSalvar.GetValue<object>(prop)));
                        var lista = conc.Select(prop => new KeyValuePair<string, string>(prop, atual.GetValue<string>(prop)));

                        //throw new ConcorrenciaException() { Erros = lista };
                    }
                }
                catch (DbUpdateException)
                {
                    dbContextTransaction.Rollback();
                    throw;
                }
                catch (DbEntityValidationException)
                {
                    dbContextTransaction.Rollback();
                    // TODO: rever implementação
                    //db.LogarEntidades(db.ChangeTracker.Entries());
                    throw;
                }
                catch (InvalidOperationException e)
                {
                    dbContextTransaction.Rollback();
                    return Content(HttpStatusCode.Accepted, new { mensagem_erro = e.Message });
                }
            }

            BeforeReturn(item);

            //return StatusCode(HttpStatusCode.NoContent);
            return Content(HttpStatusCode.OK, item);
        }

        private IHttpActionResult TestarModelState(ModelStateDictionary ModelState)
        {
            StringBuilder mensagem_erro = new StringBuilder();

            foreach (ModelState model in ModelState.Values)
            {
                if (model.Errors.Count > 0)
                {
                    if (model.Errors[0].ErrorMessage != "")
                        mensagem_erro.AppendLine(model.Errors[0].ErrorMessage);
                    else if (model.Errors[0].Exception.Message != "")
                        mensagem_erro.AppendLine(model.Errors[0].Exception.Message);
                }
            }

            if (mensagem_erro.Length == 0)
                mensagem_erro.AppendLine("Problemas de Validação!");

            return Content(HttpStatusCode.Accepted, new { mensagem_erro = mensagem_erro.ToString() });
        }

        // POST: api/T
        //[ResponseType(typeof(T))]
        //[ResponseType(typeof(void))]
        public IHttpActionResult Post(T item)
        {
            //if (typeof(IRaizDeAgregacao).IsAssignableFrom(typeof(T)))
            //{
            //    ((IRaizDeAgregacao)item).Flag = true;
            //    ModelState["item.Flag"].Errors.Clear();
            //}

            ExecutarAntesPost(item);

            if (item.id == 0)
            {
                try
                {
                    var fb = new FuncoesBanco(db);
                    item.id = fb.BuscarPKRegistro(item.GetType().Name);
                }
                catch
                {
                    return Content(HttpStatusCode.Accepted, new { mensagem_erro = "Problema com generator da tabela " + item.GetType().Name });
                }
            }

            ConfCEMP(item);

            if (!ModelState.IsValid)
            {
                return TestarModelState(ModelState);
            }

            //var result = ValidarNovaEntidade(item);
            //if (result != null)
            //{
            //    return result;
            //}

            db.Set<T>().Add(item);

            InternalUpdate(item);
            using (var dbContextTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    BeforeSaveChanges(item);
                    db.SaveChanges();
                    dbContextTransaction.Commit();
                }
                catch (DbUpdateException e)
                {
                    dbContextTransaction.Rollback();
                    if (ItemExiste(item.id))
                    {
                        return Content(HttpStatusCode.Accepted, new { mensagem_erro = "Registro já existe!" });
                        //return Conflict();
                    }
                    else
                    {
                        if (e.InnerException != null)
                            return Content(HttpStatusCode.Accepted, new { mensagem_erro = e.InnerException.InnerException.Message });
                        else
                            return Content(HttpStatusCode.Accepted, new { mensagem_erro = e.Message });
                    }
                }
                catch (DbEntityValidationException e)
                {
                    dbContextTransaction.Rollback();

                    if (e.InnerException != null)
                        return Content(HttpStatusCode.Accepted, new { mensagem_erro = e.InnerException.InnerException.Message });
                    else
                        return Content(HttpStatusCode.Accepted, new { mensagem_erro = e.Message });
                }
                catch (InvalidOperationException e)
                {
                    dbContextTransaction.Rollback();
                    return Content(HttpStatusCode.Accepted, new { mensagem_erro = e.Message });
                }
            }

            BeforeReturn(item);
            return CreatedAtRoute("DefaultApi", new { id = item.id }, item);
        }

        private void ConfCEMP(T item)
        {
            var NomeMenu = item.GetType().Name.ToUpper() + ".DLL";

            if (NomeMenu != "CAD_EMPRESA.DLL")
            {
                var MENU = db.Set<SIS_MENU>().Where(b => b.DLL == NomeMenu).FirstOrDefault();

                if (MENU != null && MENU.EMP == "S")
                {
                    foreach (var prop in item.GetType().GetProperties())
                    {
                        if (prop.Name == "CEMP")
                        {
                            prop.SetValue(item, "0");
                        }
                    }
                }
            }
        }

        private IHttpActionResult ValidarNovaEntidade(IEntidadeBase item)
        {
            if (item.id != 0)
                return BadRequest();

            var colecoes = new Dictionary<PropertyInfo, IEnumerable<IEntidadeBase>>();
            foreach (var prop in item.GetType().GetProperties().Where(pi => typeof(IEnumerable<IEntidadeBase>).IsAssignableFrom(pi.PropertyType)))
            {
                colecoes[prop] = prop.GetValue(item) as IEnumerable<IEntidadeBase>;
            }
            foreach (var salvo in colecoes)
            {
                foreach (var subItem in salvo.Value)
                {
                    var result = ValidarNovaEntidade(subItem);
                    if (result != null) return result;
                }
            }

            return null;
        }

        // DELETE: api/T/5
        //[ResponseType(typeof(T))]
        public IHttpActionResult Delete(int id)
        {
            T item = this.TrazerDadosParaEdicao(db.Set<T>()).FirstOrDefault(e => e.id == id);
            if (item == null)
            {
                return NotFound();
            }

            db.Set<T>().Remove(item);
            try
            {
                //using (var scope = new TransactionScope())
                {
                    db.SaveChanges();

                    //  scope.Complete();
                }
            }
            catch (DbUpdateException ex)
            {
                Exception inner = ex;
                do
                {
                    inner = inner.InnerException;

                    if (inner is SqlException)
                        return this.BadRequest("Este registro não pode ser excluído pois se encontra em uso pelo sistema.");
                } while (inner != null);

                throw;
            }

            return Ok(item);
        }

        private bool ItemExiste(int id)
        {
            return db.Set<T>().Count(e => e.id == id) > 0;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }

    public abstract class CrudControllerBase<T> : CrudController<T, T>
        where T : class, IEntidadeBase
    {
        protected override Expression<Func<T, T>> Selecionar()
        {
            return item => item;
        }

    }
}
