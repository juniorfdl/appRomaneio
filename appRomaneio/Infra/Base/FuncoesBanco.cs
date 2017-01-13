namespace Infra.Base
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public class FuncoesBanco
    {
        private Context db;

        public FuncoesBanco(Context db)
        {
            //this.db = (FbConnection) db.Database.Connection;
            this.db = db;
            
        }

        public List<string> ExecSql(string sql)
        {
            //db.Database.SqlQuery

            //FbDataAdapter dados = new FbDataAdapter(sql, db);
            //DataTable dt = new DataTable();
            //dados.Fill(dt);

            return db.Database.SqlQuery<string>(sql).ToList();
            
        }

        public int BuscarPKRegistro(string Generator)
        {
            int codigo = 0;

            StringBuilder xSql = new StringBuilder();

            if (Generator.Substring(0, 2) != "G_")
            {
                xSql.AppendFormat("SELECT GEN_ID({0}{1},1) AS INC FROM RDB$DATABASE", "G_", Generator);
            }
            else
            {
                xSql.AppendFormat("SELECT GEN_ID({0},1) AS INC FROM RDB$DATABASE", Generator);
            }
            xSql.AppendLine();

            List<string> dt = ExecSql(xSql.ToString());

            if (dt.Count > 0)
            {
                //DataRow row = dt.Rows[0];
                codigo = Convert.ToInt32(dt[0].ToString());
            }

            return codigo;
        }

    }
}
