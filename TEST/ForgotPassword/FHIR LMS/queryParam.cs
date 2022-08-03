using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;

namespace FHIR_LMS
{
    public class queryParam
    {
        public NameValueCollection queryDictionary { get; set; }    //store query key and value
        public void get(string uri)
        {
            string queryString = new System.Uri(uri).Query;
            this.queryDictionary = System.Web.HttpUtility.ParseQueryString(queryString);
        } 
    }
}