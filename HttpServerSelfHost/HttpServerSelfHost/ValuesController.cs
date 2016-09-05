using System.Collections.Generic;
using System.Web.Http;

namespace HttpServerSelfHost
{
    public class ValuesController : ApiController
    {
        Dictionary<int, string> dic = new Dictionary<int, string>();

        public ValuesController()
        {
            dic.Add(1, "value1");
            dic.Add(2, "value2");
        }

        // GET api/values 
        public IEnumerable<string> Get()
        {
            return this.dic.Values;
        }

        // GET api/values/5 
        public string Get(int id)
        {
            return dic[id];
        }

        // POST api/values 
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5 
        public void Put(int id, [FromBody]string value)
        {
            dic.Add(id, value);
        }

        // DELETE api/values/5 
        public void Delete(int id)
        {
            dic.Remove(id);
        }
    }
}