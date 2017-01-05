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

    public partial class VW_FAT_ROMANEIO_PAO : IEntidadeBase
    {
        [Key]
        [Column("COD_FATROMANEIOPAO")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }
        [Required]
        public string CEMP { get; set; }
        [Required]
        public string CFIL { get; set; }
        [Required]
        public int CODIGO { get; set; }
        [Required]
        public DateTime DATA_EMISSAO { get; set; }        
        public Nullable<int> NUMERO_PEDIDO { get; set; }
        [Required]
        public DateTime DATA_ENTREGA { get; set; }
        [Required]
        public String NOME_CLIENTE { get; set; }
        [Required]
        public int CODIGO_CLIENTE { get; set; }    
    }

}
