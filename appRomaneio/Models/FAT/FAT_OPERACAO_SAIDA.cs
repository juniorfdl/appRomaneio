namespace Models.FAT
{
    using Infra.Base.Interface;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public partial class FAT_OPERACAO_SAIDA : IEntidadeBase
    {
        [Key]
        [Column("COD_FATOPERACAOSAIDA")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }
        [Required]
        public string NOME { get; set; }       
    }

}
