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

    public class V_CAD_PRODUTO_FATOPESAIDA : IEntidadeBase
    {
        [Key]
        [Column("COD_CADPRODUTO")]
        public int id { get; set; }
        [Required]
        public int COD_FATOPERACAOSAIDA { get; set; }
        public int CODIGO { get; set; }
        public string PRODUTO { get; set; }
        public string OPERACAO_SAIDA { get; set; }
    }
}
