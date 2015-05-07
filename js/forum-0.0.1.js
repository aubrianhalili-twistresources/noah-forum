var ForumPage = (function() {
    // variables
    var CATEGORY_LIST_ID = 157296;
    var _SERVER_URL = 'http://forums.tooltwist.com:4000'
    var _TENANT = 'noah';

    /*
    * EXTERNAL INTERFACE
    * The JSON functions in the returned object will be available to ForumPage.
    *
    * init - will initialize the page, it will initialize the Curia object and the sidebars.
    * showCategories - displays the category page.
    * showWall - TO BE IMPLEMENTED - loads a compilation of all posts in the forum.
    * showTopic - displays the topic thread page, showing both the topic and all replies.
//    * editPost - shows an edit box that allows the user to edit a specific post.
    *
    */
    return {
        init: initialize,
        showCategories: showCategories,
        showWall: showWall,
        showTopic: showTopic
    };

    /*
    * PUBLIC FUNCTIONS
    * Place functions that will be exposed to the external interface here.
    */
    function initialize(){
        // Get page details.
        // This doesn't need to wait for the page to load.
        Curia_current_project = 157293,
        Curia_current_development_userId = 0;

        // Initialize the Curia Forum
        Curia.init({
            tenantId: _TENANT,
            debug: false,
            urlive: true,
            themes: {
                "noah_post": {
                	preprocessor:  preProcess,
                	postprocessor: postProcess,
                    "topic_0": '#noah-curia-template-topic',
                    "message_0": '#noah-curia-template-message-level-0and1',
                    "message_2": '#noah-curia-template-message-level2',
                    "file_0": '#noah-curia-template-file',
                    "link_0": '#noah-curia-template-link'
                },
                "noah_categories_fullpage": {
                    "category-list_0": '#noah-curia-template-categoryList-fullpage',
                    "category_0": '#noah-curia-template-category-fullpage',
                    "topic_0": '#noah-curia-template-topic-fullpage',
                },
                "noah_categories_sidebar": {
                    "category-list_0": '#noah-curia-template-categoryList-sidebar',
                    "category_0": '#noah-curia-template-category-sidebar',
                    "topic_0": '#noah-curia-template-topic-sidebar',
                },
                "noah_categories_mobile": {
                    "category-list_0": '#noah-curia-template-categoryList-mobile',
                    "category_0": '#noah-curia-template-category-mobile',
                    "topic_0": '#noah-curia-template-topic-mobile',
                }
            }
        });

        // Load the category list into the sidebar
        Curia.displayThread('#curia-categories-sidebar', CATEGORY_LIST_ID, 'noah_categories_sidebar');

        // Load the category list into the mobile navbar
        Curia.displayThread('#curia-categories-mobile', CATEGORY_LIST_ID, 'noah_categories_mobile');

        showCategories();

    }

    function showCategories() {
        Curia.displayThread('#curia-posts', CATEGORY_LIST_ID, 'noah_categories_fullpage');
    }

    function showWall() {
        $('#curia-posts').html('Cannot show Wall yet');
    }

    function showTopic(topicId){
        Curia.displayThread('#curia-posts', topicId, 'noah_post');
    }
 
    /*
    function editPost(containerId, postId){
alert('editPost(' + containerId + ')')    	
    	Curia.displayThread('#' + containerId, postId, 'noah_edit_post', null, postProcess);
    }
    
    function cancelPost(containerId, postId) {
    	Curia.displayPosts('#' + containerId, postId, 'noah_cancel_post', preProcess, postProcess);
    }
    
    function cancelPost(containerId, postId) {
    	Curia.displayPosts('#' + containerId, postId, 'noah_cancel_post', preProcess, postProcess);
    }
    
    function deletePost(rootId, postId){
alert('deletePost')    	
    	var $modal = $('#noah-modal-delete-post');
    	$modal.modal('show');
    	$modal.find('#modal-delete-post-btn').off('click').on('click', function(e) {
alert('clicked on delete')    		
    		Curia.displayThread('#curia-posts', rootId, 'noah_post', preProcess, function(thread){
                postProcess(thread);
                $modal.modal('hide');
                console.log('delete post:', rootId, postId);
            });
    	});
    	
    }
    */

    /*
    *
    * PRIVATE FUNCTIONS
    * Place functions that will be hidden from the external interface here.
    *
    */
    function preProcess(element, selector, level){
        
        // Patch in some derived values, nice for display by the Mustache templates.
        element.d_created_date = (element.created==0) ? "(unknown creation time)" : moment.unix(element.created).format("DD MMMM hh:mm A");
        element.d_modified_date= (element.modified==0) ? "(unknown modification time)" : moment.unix(element.modified).format("DD MMMM hh:mm A");
        element.d_created_fromNow = (element.created == 0) ? ("(Unknown creation time)") : moment.unix(element.created).fromNow();
        element.d_modified_fromNow= (element.modified == 0) ? ("(Unknown modification time)") : moment.unix(element.modified).fromNow();
        
        if (element.type == 'topic') {
            element.d_root_modified_date= (element.rootModified==0) ? "{unknown modification time)" : moment.unix(element.rootModified).format("DD MMMM hh:mm A");
            element.d_root_modified_fromNow= (element.rootModified == 0) ? ("(Unknown modification time)") : moment.unix(element.rootModified).fromNow();
            element.d_rootReplies = element.children.length;
        }
        
        // Preprocess the children
        if (element && element.children){
            jQuery(element.children).each(function(index, child){
                preProcess(child);
            });
        }
        return element;
    }

    function postProcess(thread){
    	//alert('Forum.js postProcess')    	
    }

    /*
    function initCommentForm(commentForm){
        var commentFormId = "#" + commentForm[0].id;
        
console.log('initCommentForm, ' + commentFormId + ',\n' + commentForm.attr("method") + ',\n' + commentForm.attr("action"));    	

    	
        commentForm.on("submit", function(){
        	console.log('ok 1')        
alert('SUBMIT! ' + commentFormId + ', ' + commentForm.attr("method") + ', ' + commentForm.attr("action"));    	
            clearStatus(commentFormId);
            $.ajax({
                type: commentForm.attr("method"),
                url: commentForm.attr("action"),
                data: commentForm.serialize(),
                success: function(messageResponse){

alert('Have response', messageResponse)
                    if(messageResponse && messageResponse.status && messageResponse.status === "ok"){
                        var newMessageId = messageResponse.elementId,
                        	rootId = jQuery(commentForm).find("input[name='rootId']").val(),
                        	commentBox = commentForm.find("textarea.commentBox")[0];
                        if(commentBox && commentBox.id){
                            var linkSelector = jQuery("#" + commentBox.id + "-container .urlive-link")[0],
                            	siteSelector = jQuery("#" + commentBox.id + "-container .urlive-sitename")[0],
                            	shortDescription = jQuery(linkSelector).attr("href"),
                            	description = jQuery(siteSelector) ? jQuery(siteSelector).text() : shortDescription;
                            if(shortDescription){
                                var linkData = {
                                    type: "link",
                                    parentId: newMessageId,
                                    rootId: rootId,
                                    description: shortDescription,  //for now use the shortDescription as description until API is fixed...
                                    shortDescription: shortDescription
                                };
                                saveLinks(rootId, commentForm, linkData);
                            } else  {
                                refreshThread(rootId, commentFormId);
                            }
                        }
                    } else {
                        showErrorStatus(commentFormId, "Failed to post comment.  Please try again.");
                    }
                },
                error: function(){
                    showErrorStatus(commentFormId, "Failed to post comment.  Please try again.");
                }
            });
            return false;
        });

        jQuery(commentFormId + "-status-close").on("click", function(){
            clearStatus(commentFormId);
            return false;
        });
    }

    function saveLinks(rootId, commentForm, linkData){
        var commentFormId = "#" + commentForm[0].id;
        $.ajax({
            type: commentForm.attr("method"),
            url: commentForm.attr("action"),
            data: linkData,
            success: function(linkResponse){
                if(linkResponse && linkResponse.status && linkResponse.status === "ok"){
                    refreshThread(rootId, commentFormId);
                } else {
                    showErrorStatus(commentFormId, "Failed to post link.  Please try again.");
                }
            },
            error: function(){
                showErrorStatus(commentFormId, "Failed to post link.  Please try again.");
            }
        });
    }
    */

//    /*
//     *  Reload the thread from the Curia server.
//     *  Parameter 'statusDiv' should be a jQuery selector.
//     */
//    function refreshThread_NEW(rootId, statusDivSelector){
//console.log('refreshThread_NEW(' + rootId + ')')    	
//        Curia.displayThread('#curia-posts', rootId, 'noah_post', preProcess, function(thread){
//            postProcess(thread);
//            showSuccessStatus_NEW(statusDivSelector, "Comment successfully posted.");
//        });
//    }

//    function initCommentBox(commentBoxId){
//console.log('initCommentBox, ' + commentBoxId)
//        var commentBox = "#" + commentBoxId;
//        var commentBoxClass = "." + commentBoxId;
//
//        jQuery(commentBox).on('input propertychange', function () {
//            jQuery(this).urlive({
//                container: commentBox + "-container",
//                imageSize: 'small',
//                callbacks: {
//                    onStart: function () {
//                        jQuery(commentBoxClass + "-fa-spin").show();
//                        jQuery(commentBox + "-container").urlive('remove');
//                    },
//                    onSuccess: function (data) {
//                        jQuery(commentBoxClass + "-fa-spin").hide();
//                        jQuery(commentBox + "-container").urlive('remove');
//                    },
//                    noData: function () {
//                        jQuery(commentBoxClass + "-fa-spin").hide();
//                        jQuery(commentBox + "-container").urlive('remove');
//                    }
//                }
//            });
//        }).on("focus", function() {
//            jQuery(this).css("height", "100px");
//            jQuery(commentBoxClass + "-btn-post").show();
//        }).on("blur", function() {
//            if(!jQuery.trim(jQuery(this).val())){
//                jQuery(this).css("height", "35px");
//                jQuery(commentBoxClass + "-btn-post").hide();
//            }
//        });
//    }


//    /*
//     * Functions to display status messages.
//     * 
//     *	'element' may be a jQuery selector (e.g. #elementId) or DOM element.
//     */
//    function clearStatus_NEW(element, message){
//    	var $statusElement = $(element)
//        $statusElement.hide();
//        $statusElement.removeClass("alert-success");
//        $statusElement.removeClass("alert-error");
//        $statusElement.find(".message").text();
//    }
//
//    function showSuccessStatus_NEW(element, message){
//    	var $statusElement = $(element)
//        $statusElement.addClass("alert-success");
//        $statusElement.find(".message").text(message);
//        $statusElement.show();
//    }
//
//    function showErrorStatus_NEW(element, error){
//    	var $statusElement = $(element)
//        $statusElement.addClass("alert-danger");
//        $statusElement.find(".message").text(error);
//        $statusElement.show();
//    }

}());

// Init after the page has loaded
jQuery(ForumPage.init);
