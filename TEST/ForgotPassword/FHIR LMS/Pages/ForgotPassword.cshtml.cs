using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace FHIR_LMS.Pages
{
    public class forgot_passwordModel : PageModel
    {
        public string page_url;
        public bool hasData = false;
        public string user_email = "";
        public string user_password = "";

        public void OnGet()
        {
        }

        public bool Mail_Send(string to, string mailSubject, string mailBody)
        {
            string from = "misac.tcu@gmail.com"; //From address    
            MailMessage message = new MailMessage(from, to);
            message.Subject = mailSubject;
            message.Body = mailBody;
            message.BodyEncoding = Encoding.UTF8;
            message.IsBodyHtml = true;
            SmtpClient client = new SmtpClient("smtp.gmail.com", 587); //Gmail smtp    
                                                                       //System.Net.NetworkCredential basicCredential1 = new System.Net.NetworkCredential("victoriatjiaa@gmail.com", "lanpobuqwrzguveu");
            System.Net.NetworkCredential basicCredential1 = new System.Net.NetworkCredential("misac.tcu@gmail.com", "naqjvjkpmsrlvscw");
            client.EnableSsl = true;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Credentials = basicCredential1;
            try
            {
                client.Send(message);
                return true;
            }

            catch (Exception ex)
            {
                throw ex;
                return false;
            }
        }

        private readonly Random _random = new Random();
        // Generates a random string with a given size.    
        public string RandomString(int size, bool lowerCase = false)
        {
            var builder = new StringBuilder(size);

            // Unicode/ASCII Letters are divided into two blocks
            // (Letters 65–90 / 97–122):
            // The first group containing the uppercase letters and
            // the second group containing the lowercase.  

            // char is a single Unicode character  
            char offset = lowerCase ? 'a' : 'A';
            const int lettersOffset = 26; // A...Z or a..z: length=26  

            for (var i = 0; i < size; i++)
            {
                var @char = (char)_random.Next(offset, offset + lettersOffset);
                builder.Append(@char);
            }

            return lowerCase ? builder.ToString().ToLower() : builder.ToString();
        }

        public void OnPost()
        {
        }

        public class swal
        {
            public string func_type { get; set; }
            public string header { get; set; }
            public string message { get; set; }
            public string err_type { get; set; }
            public string redirect_url { get; set; }
            public swal(string pfunc_type, string pheader, string pmessage, string perr_type, string predirect_url)
            {
                this.func_type = pfunc_type;
                this.header = pheader;
                this.message = pmessage;
                this.err_type = perr_type;
                this.redirect_url = predirect_url;
            }
        }

        public JsonResult OnGetReqToken(string user_email)
        {
            HTTPRequest req = new HTTPRequest();
            swal response= new swal("", "","","", "");

            //Check email existence
            //Step 1. Get Person by Email
            var personJSON = req.getResource("Person", "?identifier=" + user_email);

            //Step 2.1 If account unexist
            if (personJSON["total"] == 0)
            {
                response = new swal("normal", "Alert!", "Email unexist!", "error", "");
            }
            //Step 2.2 If account exist
            else if (personJSON["total"] == 1)
            {
                try
                {
                    //Setting email body and subject
                    string mailHTMLTemplate = @"<table width='100%' style='box-sizing:border-box;border-spacing:0;border-collapse:collapse;width:100%!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                                <tbody><tr style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                                <td style='box-sizing:border-box;border-radius:6px!important;display:block!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important;padding:0;border:1px solid #e1e4e8'>
                                                                    <table align='center' style='box-sizing:border-box;border-spacing:0;border-collapse:collapse;width:100%!important;text-align:center!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                                    <tbody><tr style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                                        <td style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important;padding:24px'>
                                                                        <table border='0' cellspacing='0' cellpadding='0' align='center' width='100%' style='box-sizing:border-box;border-spacing:0;border-collapse:collapse;width:100%!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                    <tbody><tr style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                    <td align='center' style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important;padding:0'>
                          
                                                <h3 style='box-sizing:border-box;margin-top:0;margin-bottom:0;font-size:20px;font-weight:600;line-height:1.25!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'><span class='il'>MISAC</span> password reset</h3>
                                                <table style='box-sizing:border-box;border-spacing:0;border-collapse:collapse;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                    <tbody style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                    <tr style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                        <td height='16' style='font-size:16px;line-height:16px;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important;padding:0'>&nbsp;</td>
                                                    </tr>
                                                    </tbody>
                                                </table>

                                                <table style='box-sizing:border-box;border-spacing:0;border-collapse:collapse;width:100%!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                    <tbody style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                    <tr style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
      
                                                    <td style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important;padding:0'>
                                                    <table style='box-sizing:border-box;border-spacing:0;border-collapse:collapse;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                    <tbody><tr style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                        <td style='box-sizing:border-box;text-align:left!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important;padding:0' align='left'>
                                                        <p style='box-sizing:border-box;margin-top:0;margin-bottom:10px;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>We heard that you lost your <span class='il'>MISAC</span> password. Sorry about that!</p>
                                                        <p style='box-sizing:border-box;margin-top:0;margin-bottom:10px;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>But don’t worry! You can use the following button to reset your password:</p>

                                                    <table border='0' cellspacing='0' cellpadding='0' align='center' width='100%' style='box-sizing:border-box;border-spacing:0;border-collapse:collapse;width:100%!important;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                    <tbody><tr style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                    <td align='center' style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important;padding:0'>
                                                        <table width='100%' border='0' cellspacing='0' cellpadding='0' style='box-sizing:border-box;border-spacing:0;border-collapse:collapse;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                    <tbody><tr style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                    <td style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important;padding:0'>
                                                        <table border='0' cellspacing='0' cellpadding='0' width='100%' style='box-sizing:border-box;border-spacing:0;border-collapse:collapse;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                        <tbody><tr style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                            <td align='center' style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important;padding:0'>
                                                                <a href='https://tzfhir1.ml/system/fhir-lms/fhir-lms/password-reset?id={reset-password-token}' style='background-color:#28a745!important;box-sizing:border-box;color:#fff;text-decoration:none;display:inline-block;font-size:inherit;font-weight:500;line-height:1.5;white-space:nowrap;vertical-align:middle;border-radius:.5em;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important;padding:.75em 1.5em;border:1px solid #28a745' target='_blank'>Reset your password</a>
                                                            </td>
                                                        </tr>
                                                        </tbody></table>
                                                    </td>
                                                    </tr>
                                                </tbody></table>

                                                </td>
                                                    </tr>
                                                 </tbody></table>

                                                    <table style='box-sizing:border-box;border-spacing:0;border-collapse:collapse;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                    <tbody style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                    <tr style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                        <td height='16' style='font-size:16px;line-height:16px;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important;padding:0'>&nbsp;</td>
                                                    </tr>
                                                    </tbody>
                                                </table>

                                                    <p style='box-sizing:border-box;margin-top:0;margin-bottom:10px;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                        Thanks,<br style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important'>
                                                        The <span class='il'>MISAC</span> Team
                                                    </p>

                                                </td>
                                                        <td style='box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important;padding:0'></td>
                                                    </tr>
                                                    </tbody></table>
                                                </td>

                                                    </tr>
                                                    </tbody>
                                                </table>


                                                </td>
                                                    </tr>
                                                </tbody></table>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody></table>
                                                                </td>
                                                                </tr>
                                                            </tbody></table>";
                    //string mailbody = "Click <a href='https://tzfhir1.ml/system/fhir-lms/fhir-lms/password-reset?id={id}' style='background-color:#28a745!important;box-sizing:border-box;color:#fff;text-decoration:none;display:inline-block;font-size:inherit;font-weight:500;line-height:1.5;white-space:nowrap;vertical-align:middle;border-radius:.5em;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;!important;padding:.75em 1.5em;border:1px solid #28a745' target='_blank'>Reset your password</a>";
                    string mailSubject = "[MISAC] Please reset your password";

                    //Check whether account already has valid password-reset-token or not
                    personJSON = personJSON["entry"][0]["resource"];
                    JArray identifier = ((JArray)personJSON["identifier"]);
                    JToken match = null;
                    match = identifier.FirstOrDefault(j => j["system"].ToString().Equals("reset-password-token"));

                    //Step 2.2.1 If account already has valid password-reset-token
                    if (match != null)
                    {
                        mailHTMLTemplate= mailHTMLTemplate.Replace("{reset-password-token}", match["value"].ToString());
                        bool isSuccess= Mail_Send(user_email, mailSubject, mailHTMLTemplate);
                        if(isSuccess)
                        {
                            string msg = "Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.";
                            page_url = "https://tzfhir1.ml/system/fhir-lms/fhir-beginner/login.html";
                            response = new swal("redirect", "Finished!", msg, "success", page_url);
                        }
                        else
                        {
                            string msg = "Email send failed! Please contact your admin.";
                            response = new swal("normal", "Finished!", msg, "success", "");
                        }
                    }
                    //Step 2.2.2 If account doesn't have valid password-reset-token
                    else
                    {
                        //Step 2.2.2.1 Create random token for reset password
                        string randomToken = RandomString(64);

                        //Step 2.2.2.2 Store reset-password-token in Person.identifier
                        dynamic newIdentifier = new JObject();
                        newIdentifier.system = "reset-password-token";
                        newIdentifier.value = randomToken;
                        ((JArray)personJSON["identifier"]).Add(newIdentifier);
                        string personSTR = JsonConvert.SerializeObject(personJSON);

                        //Step 2.2.2.3 Update Person
                        var personJSON2 = req.putResource("Person", (string)personJSON["id"], personSTR);
                        if (!isError((string)personJSON2["resourceType"]))
                        {
                            mailHTMLTemplate= mailHTMLTemplate.Replace("{reset-password-token}", randomToken);
                            //Step 2.2.2.4 Sent reset-password-link (include token) to user email
                            bool isSuccess = Mail_Send(user_email, mailSubject, mailHTMLTemplate);
                            if (isSuccess)
                            {
                                string msg = "Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.";
                                page_url = "https://tzfhir1.ml/system/fhir-lms/fhir-beginner/login.html";
                                response = new swal("redirect", "Finished!", msg, "success", page_url);
                            }
                            else
                            {
                                string msg = "Email send failed! Please contact your admin.";
                                response = new swal("normal", "Finished!", msg, "success", "");
                            }
                        }
                        else
                        {
                            response = new swal("normal", "Alert!", "FHIR CRUD Operation error! Please contact admin.", "error", "");
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    user_email = String.Empty;
                }
            }
            //Step 2.3 If multiple account with the same email exist
            else
            {
                response = new swal("normal","Alert!", "Multiple account exist! Please contact admin.", "error", "");
            }
            return new JsonResult(response);
        }

        public JsonResult OnGetResetPassword(string user_password, string token_id)
        {
            HTTPRequest req = new HTTPRequest();
            swal response = new swal("", "", "", "", "");

            //Step 1. Get Person by reset-password-token
            var personJSON = req.getResource("Person", "?identifier=" + token_id);
            string testt = HttpContext.Request.Headers["Referrer"];

            //Step 2. Check token validity
            //Step 2.1 If reset-password-token is invalid
            if (personJSON["total"] == 0)
            {
                page_url = HttpContext.Request.Path + "/ForgotPassword";
                response = new swal("redirect", "Alert!", "Your password reset link is already invalid. Please try again.", "error", page_url);
            }
            //Step 2.2 If reset-password-token is valid
            else if (personJSON["total"] == 1)
            {
                //Step 2.2.1 Modify new password
                personJSON = personJSON["entry"][0]["resource"];
                JToken currentPwd = ((JArray)personJSON["identifier"]).FirstOrDefault(j => j["system"].ToString().Equals("Password"));
                sha256 hash = new sha256();
                currentPwd["value"] = user_password;

                //Step 2.2.2 Delete token
                JToken currentToken = currentToken = ((JArray)personJSON["identifier"]).FirstOrDefault(j => j["system"].ToString().Equals("reset-password-token"));
                personJSON["identifier"].Remove(currentToken);

                //Step 2.2.3 Update Person
                string personSTR = JsonConvert.SerializeObject(personJSON);
                var personJSON2 = req.putResource("Person", (string)personJSON["id"], personSTR);

                if (!isError((string)personJSON2["resourceType"]))
                {
                    string msg = "New password set successfully";
                    page_url = "https://tzfhir1.ml/system/fhir-lms/fhir-beginner/login.html";
                    response = new swal("redirect", "Finished!", msg, "success", page_url);
                }
                else
                {
                    response = new swal("normal", "Alert!", "FHIR CRUD Operation error! Please contact admin.", "error", "");
                }
            }
            //Step 2.3 If multiple account with the same email exist
            else
            {
                response = new swal("normal", "Alert!", "Multiple account exist! Please contact admin.", "error", "");
            }
            return new JsonResult(response);
        }

            public JsonResult OnPostSubmitForm(string user_password)
        {
            string aa = user_email;
            return new JsonResult("yes");
        }

        public bool isError(string resourceType)
        {
            if (resourceType == "OperationOutcome")
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
