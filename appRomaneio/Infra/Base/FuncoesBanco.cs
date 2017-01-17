namespace Infra.Base
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Common;
    using System.Data.Entity.Infrastructure;
    using System.Dynamic;
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
            return db.Database.SqlQuery<string>(sql).ToList();            
        }        

        public virtual IEnumerable<dynamic> CollectionFromSql(string Sql, Dictionary<string, object> Parameters)
        {
            using (var cmd = db.Database.Connection.CreateCommand())
            {
                cmd.CommandText = Sql;
                if (cmd.Connection.State != ConnectionState.Open)
                    cmd.Connection.Open();

                foreach (KeyValuePair<string, object> param in Parameters)
                {
                    DbParameter dbParameter = cmd.CreateParameter();
                    dbParameter.ParameterName = param.Key;
                    dbParameter.Value = param.Value;
                    cmd.Parameters.Add(dbParameter);
                }
                                
                using (var dataReader = cmd.ExecuteReader())
                {

                    while (dataReader.Read())
                    {
                        var dataRow = GetDataRow(dataReader);
                        yield return dataRow;

                    }
                }
            }
        }

        private static dynamic GetDataRow(DbDataReader dataReader)
        {
            var dataRow = new ExpandoObject() as IDictionary<string, object>;
            for (var fieldCount = 0; fieldCount < dataReader.FieldCount; fieldCount++)
                dataRow.Add(dataReader.GetName(fieldCount), dataReader[fieldCount]);
            return dataRow;
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
