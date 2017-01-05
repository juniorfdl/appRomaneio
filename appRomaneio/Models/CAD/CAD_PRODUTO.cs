namespace Models.Cadastros
{
    using Infra.Base.Interface;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public class CAD_PRODUTO : IEntidadeBase
    {
        [Key]
        [Column("COD_CADPRODUTO")]
        public int id { get; set; }
        [Required]
        public string NOME { get; set; }
        [Required]
        public string CODIGO { get; set; }
        public int? COD_CADUNIDADE { get; set; }
        
    }
}
