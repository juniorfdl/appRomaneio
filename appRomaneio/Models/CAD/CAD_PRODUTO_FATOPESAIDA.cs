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

    public class CAD_PRODUTO_FATOPESAIDA : IEntidadeBase
    {
        [Key]
        [Column("COD_CADPRODUTO")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }
        [Required]
        public int COD_FATOPERACAOSAIDA { get; set; }
        [NotMapped]
        public int COD_PRODUTO { get; set; }
        [NotMapped]
        public string PRODUTO_NOME { get; set; }        
    }
}
