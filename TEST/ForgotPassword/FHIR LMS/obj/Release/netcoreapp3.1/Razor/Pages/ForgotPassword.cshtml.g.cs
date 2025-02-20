#pragma checksum "E:\Cia\Coding\Project FHIR\LMS\LIVE\FHIR LMS\FHIR LMS\Pages\ForgotPassword.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "969011817ec8a08e1e604c2eb601da294f761931"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(FHIR_LMS.Pages.Pages_ForgotPassword), @"mvc.1.0.razor-page", @"/Pages/ForgotPassword.cshtml")]
namespace FHIR_LMS.Pages
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "E:\Cia\Coding\Project FHIR\LMS\LIVE\FHIR LMS\FHIR LMS\Pages\_ViewImports.cshtml"
using FHIR_LMS;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"969011817ec8a08e1e604c2eb601da294f761931", @"/Pages/ForgotPassword.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"05633f1686cc1576f5fe7abac7efbaf3159e7061", @"/Pages/_ViewImports.cshtml")]
    public class Pages_ForgotPassword : global::Microsoft.AspNetCore.Mvc.RazorPages.Page
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("id", new global::Microsoft.AspNetCore.Html.HtmlString("forgot-password-form"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_1 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("class", new global::Microsoft.AspNetCore.Html.HtmlString("form-group"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_2 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("method", "post", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_3 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("class", new global::Microsoft.AspNetCore.Html.HtmlString("card shadow-none"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_4 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("runat", new global::Microsoft.AspNetCore.Html.HtmlString("server"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        #line hidden
        #pragma warning disable 0649
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperExecutionContext __tagHelperExecutionContext;
        #pragma warning restore 0649
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner __tagHelperRunner = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner();
        #pragma warning disable 0169
        private string __tagHelperStringValueBuffer;
        #pragma warning restore 0169
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __backed__tagHelperScopeManager = null;
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __tagHelperScopeManager
        {
            get
            {
                if (__backed__tagHelperScopeManager == null)
                {
                    __backed__tagHelperScopeManager = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager(StartTagHelperWritingScope, EndTagHelperWritingScope);
                }
                return __backed__tagHelperScopeManager;
            }
        }
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper;
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.RenderAtEndOfFormTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper;
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            WriteLiteral(@"
<!-- BACKGROUND-IMAGE -->
<div class=""login-img"">
    <!-- GLOABAL LOADER -->
    <div id=""global-loader"">
        <img src=""/assets/images/loader.svg"" class=""loader-img"" alt=""Loader"">
    </div>
    <!-- End GLOABAL LOADER -->
    <!-- PAGE -->
    <div class=""page"">
        <div");
            BeginWriteAttribute("class", " class=\"", 350, "\"", 358, 0);
            EndWriteAttribute();
            WriteLiteral(@">
            <!-- CONTAINER OPEN -->
            <div class=""col col-login mx-auto"">
                <div class=""text-center"">
                    <h1 style=""color:white; font-weight:bold;"">FHIR LMS</h1>
                </div>
            </div>
            <div class=""container-login100"">
                <div class=""row"">
                    <div class=""col col-login mx-auto"">
                        ");
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("form", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "969011817ec8a08e1e604c2eb601da294f7619315622", async() => {
                WriteLiteral(@"
                            <div class=""card-body"">
                                <div class=""text-center"">
                                    <span id=""labelTitle"" class=""login100-form-title""></span>
                                </div>
                                <div class=""pt-3"" id=""forgot"">
                                    ");
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("form", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "969011817ec8a08e1e604c2eb601da294f7619316238", async() => {
                    WriteLiteral(@"
                                        <div id=""panelReqToken"" style=""display:none;"">
                                            <label for=""tb_email"" class=""form-label"">Email</label>
                                            <input id=""tb_email"" class=""form-control"" type=""email"" required>
                                            <div id=""validate_email"" class=""invalid-feedback"" style=""display:none;"">Please input your Email</div>
                                        </div>
                                        <div id=""panelResetPassword"" style=""display:none;"">
                                            <label for=""tb_password"" class=""form-label"">Password</label>
                                            <input id=""tb_password"" class=""form-control"" type=""password"" onkeyup=""hash_password.value = sha256(this.value);"">
                                            <input id=""hash_password"" type=""hidden""/>
                                            <div id=""validate_password"" class=""inval");
                    WriteLiteral("id-feedback\" style=\"display:none;\">Please input your password</div>\r\n                                        </div>\r\n                                    ");
                }
                );
                __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper);
                __Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.RenderAtEndOfFormTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper);
                __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_0);
                __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_1);
                __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper.Method = (string)__tagHelperAttribute_2.Value;
                __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_2);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                WriteLiteral(@"
                                    <div class=""submit"">
                                        <br/><a id=""button_submit"" class=""btn btn-primary d-grid"">Submit</a>
                                    </div>
                                </div>
                            </div>
                            <div class=""card-footer"">
");
                WriteLiteral("                            </div>\r\n                        ");
            }
            );
            __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper);
            __Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.RenderAtEndOfFormTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper);
            __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_3);
            __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper.Method = (string)__tagHelperAttribute_2.Value;
            __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_2);
            __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_4);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            WriteLiteral("\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!-- CONTAINER CLOSED -->\r\n        </div>\r\n    </div>\r\n    <!--END PAGE -->\r\n\r\n</div>\r\n");
            DefineSection("scripts", async() => {
                WriteLiteral(@"
    <script>
        var query_param;
        //Step 1.Function Initialization
        $(document).ready(function () {
            $(""#global-loader"").show();
            //document.getElementById(""global-loader"").style.display=""block"";
            query_param = new URLSearchParams(window.location.search)
            if (!query_param.has('id')) {
                labelTitle.innerHTML = ""Reset your password"";
                panelResetPassword.style.display = ""none"";
                panelReqToken.style.display = ""block"";
            }
            else {
                //Check token validity
                //Step 1. Get Person by reset-password-token
                var personJSON = getResource(FHIRURL, 'Person', '?identifier=' + query_param.get('id'), FHIRResponseType, 'verifyUser');
            }
        });

        function verifyUser(str) {
            let obj = JSON.parse(str)
            //Step 2.1 If account unexist
            if (obj.total == 0) {
                var message ");
                WriteLiteral(@"= ""It looks like you clicked on an invalid password reset link. Please try again."";
                var page_url = window.location.href.split('?')[0];
                alertRedirect('Alert!', message, 'error', page_url);
            }
            //Step 2.2 If account exist
            else if (obj.total == 1) {
                labelTitle.innerHTML = ""Change password"";
                panelReqToken.style.display = ""none"";
                panelResetPassword.style.display = ""block"";
            }
        }


        $(""#button_submit"").click(function () {
            $(""#global-loader"").show();
            if (!query_param.has('id')) {
                var user_email = $('#tb_email').val();
                if (user_email != '')
                {
                    validate_email.style.display = ""none"";
                    $.ajax({
                        type: ""GET"",
                        url: '");
#nullable restore
#line 118 "E:\Cia\Coding\Project FHIR\LMS\LIVE\FHIR LMS\FHIR LMS\Pages\ForgotPassword.cshtml"
                         Write(Url.Page("forgotpassword", "ReqToken"));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"',
                        contentType: ""application/json; charset=utf-8"",
                        dataType: ""json"",
                        data: ""user_email="" + user_email,
                        success: function (response) {
                            if (response.func_type == ""normal"") {
                                alertNormal(response.header, response.message, response.err_type);
                            }
                            else if (response.func_type == ""redirect"") {
                                alertRedirect(response.header, response.message, response.err_type, response.redirect_url);
                            }
                        },
                        failure: function (response) {
                            alertNormal('Alert!', response, 'error');
                        }
                    });
                }
                else
                {
                    $(""#validate_email"").show();
                    $(""#global-loader"").hide");
                WriteLiteral(@"();
                }
            }
            else {
                var user_password = $('#hash_password').val();
                if (user_password != '') {
                    $.ajax({
                        type: ""GET"",
                        url: '");
#nullable restore
#line 146 "E:\Cia\Coding\Project FHIR\LMS\LIVE\FHIR LMS\FHIR LMS\Pages\ForgotPassword.cshtml"
                         Write(Url.Page("forgotpassword", "ResetPassword"));

#line default
#line hidden
#nullable disable
                WriteLiteral(@"',
                        contentType: ""application/json; charset=utf-8"",
                        dataType: ""json"",
                        data: ""user_password="" + user_password + ""&token_id="" + query_param.get('id'),
                        success: function (response) {
                            if (response.func_type == ""normal"") {
                                alertNormal(response.header, response.message, response.err_type);
                            }
                            else if (response.func_type == ""redirect"") {
                                alertRedirect(response.header, response.message, response.err_type, response.redirect_url);
                            }
                        },
                        failure: function (response) {
                            alertNormal('Alert!', response, 'error');
                        }
                    });
                }
                else {
                    $(""#validate_password"").show();
             ");
                WriteLiteral(@"       $(""#global-loader"").hide();
                }
            }
        });


        function alertNormal(ptitle, pmessage, picon) {
            $(""#global-loader"").hide();
            Swal.fire({
                title: ptitle,
                text: pmessage,
                icon: picon
            })
            $('#tb_email').val('');
            $('#tb_password').val('');
        }

        function alertRedirect(ptitle, pmessage, picon, purl) {
            $(""#global-loader"").hide();
            Swal.fire({
                title: ptitle,
                text: pmessage,
                icon: picon
            }).then(function () {
                $('#tb_email').val('');
                $('#tb_password').val('');
                window.open(purl, ""_self"");
            });
        }

    </script>
");
            }
            );
            WriteLiteral("    <!-- BACKGROUND-IMAGE CLOSED -->\r\n");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<FHIR_LMS.Pages.forgot_passwordModel> Html { get; private set; }
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary<FHIR_LMS.Pages.forgot_passwordModel> ViewData => (global::Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary<FHIR_LMS.Pages.forgot_passwordModel>)PageContext?.ViewData;
        public FHIR_LMS.Pages.forgot_passwordModel Model => ViewData.Model;
    }
}
#pragma warning restore 1591
