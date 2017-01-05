using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infra.Base.Interface.Base
{
    public class ResultadoDaBusca<T>
    {
        public IQueryable<T> lista { get; set; }
        public int totalCount { get; set; }
    }
}
