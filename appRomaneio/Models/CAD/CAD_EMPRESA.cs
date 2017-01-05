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

    public class CAD_EMPRESA : IEntidadeBase
    {
        [Key]
        [Column("COD_CADEMPRESA")]
        public int id { get; set; }
        [Required]
        public string NOME { get; set; }
        [Required]
        public string FANTASIA { get; set; }
        [Required]
        public string CEMP { get; set; }        
    }
}
