using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Infra.Base
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [NotMapped]
    public class FiltrosBase
    {
       public FiltrosBaseCampos Campos { get; set; }
    }

    [NotMapped]
    public class FiltrosBaseCampos
    {
        public string NOME { get; set; }
        public string VALOR { get; set; }
    }
}