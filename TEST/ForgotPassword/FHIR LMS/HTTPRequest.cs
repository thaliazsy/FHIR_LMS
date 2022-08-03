using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace FHIR_LMS
{
    public class HTTPRequest
    {
        string  FHIRURL = "https://tzfhir1.ml/fhirvh/fhir/";
        public dynamic postResource(string ResourceName, string parameter, string RequestData)
        {
            string url = FHIRURL + ResourceName + "/" + parameter;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ContentType = "text/json";

            //Convert string to byte[]
            byte[] byteArray = Encoding.UTF8.GetBytes(RequestData);
            using (Stream reqStream = request.GetRequestStream())
            {
                reqStream.Write(byteArray, 0, byteArray.Length);
            }

            //Send request
            string responseString = "";
            using (WebResponse response = request.GetResponse())
            {
                using (StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8))
                {
                    responseString = reader.ReadToEnd();
                }
            }

            dynamic responseJSON = JsonConvert.DeserializeObject(responseString);
            return responseJSON;
        }

        public dynamic putResource(string ResourceName, string parameter, string RequestData)
        {
            string url = FHIRURL + ResourceName + "/" + parameter;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "PUT";
            request.ContentType = "text/json";

            //Convert string to byte[]
            byte[] byteArray = Encoding.UTF8.GetBytes(RequestData);
            using (Stream reqStream = request.GetRequestStream())
            {
                reqStream.Write(byteArray, 0, byteArray.Length);
            }

            //Send request
            string responseString = "";
            using (WebResponse response = request.GetResponse())
            {
                using (StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8))
                {
                    responseString = reader.ReadToEnd();
                }
            }

            dynamic responseJSON = JsonConvert.DeserializeObject(responseString);
            return responseJSON;
        }

        public dynamic getResource(string ResourceName, string parameter)
        {
            string url = FHIRURL + ResourceName + parameter;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.ContentType = "application/json";
            //request.Method = "POST";
            var response = (HttpWebResponse)request.GetResponse();
            var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
            dynamic responseJSON = JsonConvert.DeserializeObject(responseString);
            return responseJSON;
        }
    }
}