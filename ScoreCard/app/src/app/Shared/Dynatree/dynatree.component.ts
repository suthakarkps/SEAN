import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'dynatree',
    templateUrl: './dynatree.template.html',
})

export class DynaTree implements OnInit {
    showtree = "none";
    dynatreeValue;
    i: number = 1;
    private el: HTMLElement;
    vpath = $("#VirtualPath").val();
    tree_type = 1;
    attr_key = null;
    ChildNode = true;
    selectedKeys;
    physician_selected = false;
    facility_selected = false;
    selectedParent = new Array;
    selectedChild = new Array;
    globalId = "all";
    toggleArrow = 'fa-angle-down';
    @Output() output_dynatreeValue = new EventEmitter();

    constructor(el: ElementRef) {
        this.el = el.nativeElement;
    }

    dropdown() {

        if (this.i % 2) {
            this.showtree = "block";
            this.toggleArrow = 'fa-angle-up';
        }
        else {
            this.showtree = "none";
            $(".advanceSearch").hide();
            this.toggleArrow = 'fa-angle-down';
            this.i = 0
        }
        this.i++;
    }
    onClick(event) {
        if (!this.el.contains(event.target)) {
            if (event.target.parentNode != null) {
                if (!event.target.parentNode.classList.contains("dynatree-container")) {
                    this.showtree = "none";
                    this.toggleArrow = 'fa-angle-down';
                    this.i = 1;
                }
            }
        }
    }

    dynatree(a) {
        var arg = a;
        var tree_type = arg[0];
        var removeAll = arg[1];
        $("#errormsg").hide();


        //if (this.Get_SearchFacility() == "" && this.Get_SearchPcp() == "") {
        //    $("#advfilter").hide();
        //}
        //else {
        //    $("#advfilter").show();
        //}

        var that = this;
        var tree_Common_options = {

            fx: { height: "toggle", duration: 200 },
            initAjax: {
                type: "POST",
                url: sessionStorage["Practice"],
                data: {
                    "DBKey": sessionStorage["InstanceID"],
                    "Practice": "PRACTICE",
                    "pcmhId": "All",
                    "type": true,
                    "searchterm": that.Get_SearchFacility() //persistence for advance search (FACILITY)
                }
            },
            onLazyRead: function (node) {
                if (node.data.title != 'All') {
                    node.appendAjax({
                        type: "POST",
                        url: sessionStorage["Provider"],
                        data: {
                            "DBKey": sessionStorage["InstanceID"],
                            "provider": "PROVIDER",
                            "key": node.data.title,
                            "searchterm": that.Get_SearchPcp() //persistence for advance search (PCP)
                        },
                        success: function (data) {
                            var Lnodes = node.getChildren();
                            if (Lnodes != null && Lnodes != undefined) {
                                //--TO SELECT THE CHILD NODES
                                for (var i = 0; i < Lnodes.length; i++) {
                                    if (data.bSelected == true) {
                                        Lnodes[i].select(true);
                                    }
                                    else if (that.selectedChild.length > 0) {
                                        for (var c = 0; c < that.selectedChild.length; c++) {
                                            var cname = that.selectedChild[c].split("#");
                                            if (cname[0] == node.data.key) {
                                                if (cname[1] == Lnodes[i].data.key) {
                                                    Lnodes[i].select(true);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            //---------------------------
                        },
                    });
                } else {
                    node.visit(function (n) {
                        n.expand(false);
                    });
                }
            },
            onPostInit: function (isReloading, isError) {

                var treecount = $(this.el).find(".tree-start").dynatree("getRoot").childList;
                if (treecount != null && treecount != undefined) {
                    if (treecount.length <= 1) {
                        $("#tree_Filter").hide();
                        $("#errormsg").show();
                    }
                }
                var tree = $(that.el).find(".tree-start").dynatree("getTree");

                for (var i = 0; i < that.selectedParent.length; i++) {

                    var temp = that.selectedParent[i].split('#')[1];

                    if (that.selectedParent[i].toLowerCase().indexOf("select") >= 0) {
                        //--TO SELECT THE PARENT NODES
                        $(that.el).find(".tree-start").dynatree("getTree").selectKey(temp, true);
                    }
                    //else if ($("#Maction").val() === "PayerDashboard") //--IF IT'S PAYER DASHBOARD THEN SELECT THE NODES
                    //{
                    //    $(this.el).find(".tree-start").dynatree("getTree").selectKey(temp, true);
                    //}
                    else { //--TO EXPAND PARENT NODES
                        var tnode = tree.getNodeByKey(temp);

                        if (tnode != null) {
                            tnode.visitParents(function (node) {
                                node.toggleExpand();
                            }, true);
                        }
                    }
                }
                //----------REMOVE All OPTION IN PANEL
                //if ($("#Maction").val() === "Panel") {
                //    var rnode = tree.getNodeByKey("All^All");
                //    if (rnode != null) {
                //        rnode.remove();
                //    }
                //} //----------REMOVE All OPTION IN Attribution
                //else if ($("#Maction").val() === "Attribution") {
                //    var rnode = tree.getNodeByKey("All^All");
                //    if (rnode != null) {
                //        rnode.remove();
                //    }
                //    if (that.physician_selected == false && that.facility_selected == false) {
                //        $(this.el).find(".tree-start").dynatree("getTree").selectKey(that.attr_key, true);
                //        that.Get_Selected_Tree_Values();
                //    }
                //}
                //--------------------------------------slimScroll
                //$('.dynatree-container').slimScroll({
                //    size: '4px',
                //    railVisible: true,
                //});
            },
            onSelect: function (flag, node) {
                var selectedNodes = node.tree.getSelectedNodes();

                that.selectedKeys = $.map(selectedNodes, function (node) { //--child
                    if (node.data.isLazy == false) {
                        if ($("#Maction").val() === "PayerDashboard" || node.data.key == "All^All") {
                            if (node.data.key.split("^")[1] == "All")
                                return node.data.title + "#All";
                            else
                                return node.data.title + "#All#" + node.data.key;
                        }
                        else {
                            return node.parent.data.title + "#" + node.data.key + "#" + node.data.title + "#" + node.parent.data.key;
                        }
                    }
                    else { //-parent
                        if (node.data.key.split("^")[1] == "All")
                            return node.data.title + "#All";
                        else
                            return node.data.title + "#All#" + node.data.key;
                    }
                });
            },
            strings: {
                loading: "Loading...!",
                loadError: "error"
            }
        }


        var Additional_options;
        if (this.tree_type == 1) //-> provider and facility select (radio)
        {
            var j = 0;
            Additional_options = {
                checkbox: true,
                classNames: { checkbox: "dynatree-radio" },
                selectMode: 1,
                onCreate: function (dtnode, nodeSpan) {

                }
            };
        }
        else if (this.tree_type == 2) //Only Provider Select
        {
            Additional_options = {
                checkbox: true,
                classNames: { checkbox: "dynatree-radio" },
                selectMode: 1,
                onCustomRender: function (node) {
                    if (node.data.title == "viewmore") {
                        var html = "<a href='javascript:void(0)' class='dynaviewmore' onclick=\"AdvSearch('" + node.data.key + "')\">View More</a>";
                        return html;
                    }
                },
                onCreate: function (dtnode, nodeSpan) {
                    if (dtnode.data.isLazy == true || dtnode.data.title == "viewmore") {
                        dtnode.data.hideCheckbox = true;
                        dtnode.render(true);
                    }
                },
            };
        }
        else // default multiselect
        {
            Additional_options = {
                checkbox: true,
                selectMode: 3
            };
        }
        $.extend(tree_Common_options, Additional_options);
        //--------------------------INITIALIZE TREEVIEW BASED ON OPTION
        $(this.el).find(".tree-start").dynatree(tree_Common_options);
    }

    AdvanceSearch() {
        $("#adv_practice").val(this.Get_SearchFacility());
        $("#adv_provider").val(this.Get_SearchPcp());

        $(this.el).find(".tree-container").hide();
        $(this.el).find(".advanceSearch").show();
    }

    AdvanceSearchCancel() {
        $(this.el).find(".tree-container").show();
        $(this.el).find(".advanceSearch").hide();
    }

    AdvanceSearchResult() {
        var spractice = $("#adv_practice").val();
        var sprovider = $("#adv_provider").val();

        if ($.trim(spractice) == "" && $.trim(sprovider) == "") {
            //StatusMessage("Warning", "Enter Practice /Provider", 2);
            return false;
        }
        this.Advance_SaveFacility(spractice);
        this.Advance_SavePcp(sprovider);

        $(this.el).find(".tree-container").show();
        $(this.el).find(".advanceSearch").hide();

        if ($(this.el).find('.tree-start')[0].children.length > 0) {
            $(this.el).find('.tree-start').dynatree("destroy");
            this.dynatree(this.Get_TreeType()); //-Init Hierarchy Tree
        }
    }

    ClearSearch() {
        $("#adv_practice").val("");
        $("#adv_provider").val("");
        sessionStorage.removeItem(this.vpath + "SearchFacility");
        sessionStorage.removeItem(this.vpath + "SearchPcp");
        $(this.el).find('.tree-start').show();
        if ($(this.el).find('.tree-start')[0].children.length > 0) {
            $(this.el).find('.tree-start').dynatree("destroy");
            this.dynatree(this.Get_TreeType()); //-Init Hierarchy Tree
        }

        $(this.el).find(".tree-container").show();
        $(this.el).find(".advanceSearch").hide();
    }
    Advance_SaveFacility(practice) {
        if (typeof (Storage) !== "undefined") {
            sessionStorage[this.vpath + "SearchFacility"] = practice;
        }
    };
    //----------------------------------------
    Advance_SavePcp(provider) {
        if (typeof (Storage) !== "undefined") {
            sessionStorage[this.vpath + "SearchPcp"] = provider;
        }
    };

    Cancel() {
        this.showtree = "none";
        this.i++;
    }
    Load_content() {

        if (this.Validate_filters()) {
            var _SelectedNodes = this.Get_Selected_Tree_Values().split("^");
            var _practice = _SelectedNodes[0]
            var _Pcp = _SelectedNodes[1]

            if (_practice == null || _practice == undefined || _practice == "") {
                _practice = this.GetPractice();
            }

            if (_Pcp == null || _Pcp == undefined || _Pcp == "") {
                _Pcp = "All";
            }

            //sessionStorage["SelectedNodeTitle"] = $(this.el).find(".tree-start").dynatree("getSelectedNodes")[0].data.title;            
            sessionStorage[this.vpath + "Facility"] = _practice;

            let outputObj = {}
            this.dynatreeValue = $(this.el).find(".tree-start").dynatree("getSelectedNodes")[0].data.title;
            outputObj["facility"] = sessionStorage[this.vpath + "Facility"];
            outputObj["pcpNode"] = sessionStorage[this.vpath + "PcpNode"];
            outputObj["physician"] = sessionStorage[this.vpath + "Physician"];
            this.output_dynatreeValue.emit(outputObj);
            this.showtree = "none";
            this.toggleArrow = 'fa-angle-down';
            this.i++;
        }
    };

    SearchPractice() {
        var name = $("#SearchPractice").val();
        var that = this;
        if (name == null || name == undefined || $.trim(name) == "") {
            return false;
        }

        var searchFrom = $(that.el).find('.tree-start').dynatree("getRoot");
        var match = undefined;

        searchFrom.visit(function (node) {
            if (node.data.title.toLowerCase().search(name.toLowerCase()) != -1) {
                match = node;

                //$("#tree_Filter").dynatree("getTree").selectKey(name);
                $(that.el).find('.tree-start').dynatree("getTree").activateKey(match.data.key);

                $('ul.dynatree-container').animate({ // animate the scrolling to the node
                    scrollTop: $(match.li).offset().top - $('ul.dynatree-container').offset().top + $('ul.dynatree-container').scrollTop()
                }, 'slow');
                return false; // Break if found
            }
        });
    };

    Validate_filters = function () {
        var status = true;
        this.selectedKeys = $.map($(this.el).find(".tree-start").dynatree("getSelectedNodes"), function (node) {
            if (node.data.isLazy == false) {
                if (node.data.key == "All^All") {
                    if (node.data.key.split("^")[1] == "All")
                        return node.data.title + "#All";
                    else
                        return node.data.title + "#All#" + node.data.key;
                }
                else {
                    return node.parent.data.title + "#" + node.data.key + "#" + node.data.title + "#" + node.parent.data.key;
                }
            }
            else { //-parent
                if (node.data.key.split("^")[1] == "All")
                    return node.data.title + "#All";
                else
                    return node.data.title + "#All#" + node.data.key;
            }
        });
        if (this.selectedKeys != undefined) {
            if (this.selectedKeys.length == 0) {
                status = false;
                //StatusMessage("Warning", "Select atleast one Practice/Provider", 2);
            }
        }
        else {
            status = false;
            //StatusMessage("Warning", "Select atleast one Practice/Provider", 2);
        }
        return status;
    }

    GetPractice = function () {
        if (sessionStorage[this.vpath + "FacilityNode"] != null) {
            return sessionStorage[this.vpath + "FacilityNode"].split("#")[1].split("^")[0];
        }
        else {
            return "";
        }
    }
    //----------------------------------------

    Get_TreeType = function () {
        if (typeof (Storage) !== "undefined") {
            if (sessionStorage[this.vpath + "TreeType"] != null) {
                return sessionStorage[this.vpath + "TreeType"];
            } else {
                return "";
            }
        } else {
            return "";
        }
    };

    Get_SearchFacility = function () {
        if (typeof (Storage) !== "undefined") {
            if (sessionStorage[this.vpath + "SearchFacility"] != null) {
                return sessionStorage[this.vpath + "SearchFacility"];
            } else {
                return "";
            }
        } else {
            return "";
        }
    };
    //----------------------------------------
    Get_SearchPcp = function () {
        if (typeof (Storage) !== "undefined") {
            if (sessionStorage[this.vpath + "SearchPcp"] != null) {
                return sessionStorage[this.vpath + "SearchPcp"]
            } else {
                return "";
            }
        } else {
            return "";
        }
    };

    Get_Selected_Tree_Values = function () {
        var FacilityNode = new Array; //-parent node
        var ProviderNode = new Array; //-childnode

        var removeval;
        var that = this;
        that.selectedParent.length = 0; //Parent
        that.selectedChild.length = 0; //Child

        if (that.selectedKeys != undefined) {
            if (that.selectedKeys.length > 0) {
                $.each(that.selectedKeys, function (index, value) {
                    var str_arr = value.split("#");

                    if (str_arr[1] == "All") { //--Parent
                        removeval = str_arr[0];
                        if (str_arr[2] !== null && str_arr[2] !== undefined && str_arr[2] !== '') {

                            var variable1 = str_arr[2].split('^')[1].split("~");

                            ProviderNode.push(variable1);

                            //DETAILS OF PARENTNODE THAT HAS TO BE SELECTED WHILE LOADING TREE
                            that.selectedParent.push("Select#" + str_arr[2]);
                        }
                        else {
                            FacilityNode.push(str_arr[0]);//For loading data onclick

                            //DETAILS OF PARENT NODE THAT HAS TO BE SELECTED WHILE LOADING TREE
                            that.selectedParent.push("Select#" + removeval + "^" + str_arr[1]);
                        }
                    }
                    else { //--Child
                        if (removeval != str_arr[0]) {

                            ProviderNode.push(str_arr[1]); //For loading data onclick

                            //DETAILS OF NODE THAT HAS TO BE EXPAND WHILE LOADING TREE
                            that.selectedParent.push("Expand#" + str_arr[3]);

                            //DETAILS OF CHILD NODE THAT HAS TO BE SELECTED WHILE LOADING TREE
                            that.selectedChild.push(str_arr[2] + "#" + str_arr[1]);
                        }
                    }
                });
                that.SaveFacilityNode(that.selectedParent.join("|"));
                that.SavePcpNode(that.selectedChild.join("|"));

                //that.Save_Facility(FacilityNode.join("|"));
                that.Save_Physician(ProviderNode.join("|"));

                return FacilityNode.join("|") + "^" + ProviderNode.join("|");
            }
        }

    }
    ngOnInit() {
        //if (sessionStorage[this.vpath + "Facility"] == null || sessionStorage[this.vpath + "Facility"] == undefined || sessionStorage[this.vpath + "Facility"] == "") {
        sessionStorage[this.vpath + "Facility"] = "All";
        sessionStorage[this.vpath + "FacilityNode"] = "Select#All^All";
        //}
        sessionStorage.setItem("providerName", "All");
        sessionStorage.setItem("practiceName", "All");
        this.dynatreeValue = "All";
        this.load_filters();

    }

    load_filters = function () {
        var rvalue = false;
        this.treetype = ["1"];
        this.treetype = this.treetype || "multiple";
        this.SaveTreeType(this.treetype); //persistence for tree type      

        // if (true) {                      
        //var Persistence_Facility = this.Get_FacilityNode(); //CHECK FOR PERSISYENCE
        //var persistence_Pcp = this.Get_PcpNode(); //CHECK FOR PERSISYENCE
        //if (Persistence_Facility != "" && Persistence_Facility != undefined) {
        //--BUILD TREE DATA
        //this.Load_Tree_Data(Persistence_Facility, persistence_Pcp);
        this.Load_Tree_Data("Select#All^All");
        //}
        this.dynatree(this.treetype); //-Init Hierarchy Tree
        //}
        return rvalue;
    };

    Get_FacilityNode = function () {
        if (typeof (Storage) !== "undefined") {
            if (sessionStorage[this.vpath + "FacilityNode"] != null) {
                return sessionStorage[this.vpath + "FacilityNode"];
            } else {
                return "";
            }
        } else {
            return "";
        }
    };
    Get_PcpNode = function () {
        if (typeof (Storage) !== "undefined") {
            if (sessionStorage[this.vpath + "PcpNode"] != null) {
                return sessionStorage[this.vpath + "PcpNode"];
            } else {
                return "";
            }
        } else {
            return "";
        }
    };

    SaveTreeType() {
        var arg = arguments;
        if (typeof (Storage) !== "undefined") {
            sessionStorage[this.vpath + "TreeType"] = arg[0];
        }
    };
    Load_Tree_Data(Facility, Pcp) {

        if (Pcp != undefined) {

            this.selectedChild = Pcp.split("|");

            if (this.selectedChild.length > 0) {
                this.physician_selected = true;
            }
        }
        if (Facility != undefined) {
            this.selectedParent = Facility.split("|");

            if (this.selectedParent.length > 0) {
                this.facility_selected = true;
            }
        }
    };

    SaveFacilityNode = function () {
        var arg = arguments;
        if (typeof (Storage) !== "undefined") {
            sessionStorage[this.vpath + "FacilityNode"] = arg[0];
        }
    };
    //----------------------------------------
    SavePcpNode = function () {
        var arg = arguments;
        if (typeof (Storage) !== "undefined") {
            sessionStorage[this.vpath + "PcpNode"] = arg[0];
        }
    };
    //----------------------------------------
    //----------------------------TO STORE FACILITY AND PCP DETAILS TO LOAD DATA
    Save_Facility = function () {
        var arg = arguments;
        if (typeof (Storage) !== "undefined") {
            sessionStorage[this.vpath + "Facility"] = arg[0];
        }
    };
    //----------------------------------------
    Save_Physician = function () {
        var arg = arguments;
        if (typeof (Storage) !== "undefined") {
            sessionStorage[this.vpath + "Physician"] = arg[0];
        }
    };
}