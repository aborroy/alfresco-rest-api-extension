package org.alfresco.rest.api.ext.repo;

import org.alfresco.repo.domain.node.ibatis.DocumentSelectEntity;
import org.alfresco.repo.domain.node.ibatis.ExtendedNodeDAOImpl;
import org.alfresco.rest.api.model.Node;
import org.alfresco.rest.framework.WebApiDescription;
import org.alfresco.rest.framework.resource.EntityResource;
import org.alfresco.rest.framework.resource.actions.interfaces.EntityResourceAction;
import org.alfresco.rest.framework.resource.parameters.CollectionWithPagingInfo;
import org.alfresco.rest.framework.resource.parameters.Paging;
import org.alfresco.rest.framework.resource.parameters.Parameters;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.StoreRef;

import java.util.ArrayList;
import java.util.List;

import static org.alfresco.rest.framework.resource.parameters.Paging.DEFAULT_MAX_ITEMS;
import static org.alfresco.rest.framework.resource.parameters.Paging.DEFAULT_SKIP_COUNT;

@EntityResource(name="all", title = "All")
public class DocumentsEntityResource implements EntityResourceAction.Read<Node> {

    private ExtendedNodeDAOImpl nodeDAO;

    /**
     *  Returns a paged list of Document Ids.
     *
     *  GET http://localhost:8080/alfresco/api/-default-/public/alfresco/versions/1/all
     *
     *  @param parameters may include:
     *    * maxItems, int, maximum number of items in the response
     *    * skipCount, int, omit initial number of results in the response
     *  @return list of Document Ids
     */
    @Override
    @WebApiDescription(title="A paged list of all content nodes in the repository.")
    public CollectionWithPagingInfo<Node> readAll(Parameters parameters) {

        int maxItems = DEFAULT_MAX_ITEMS;
        int skipCount = DEFAULT_SKIP_COUNT;
        if (parameters.getPaging() != null) {
            maxItems = parameters.getPaging().getMaxItems();
            skipCount = parameters.getPaging().getSkipCount();
        }

        DocumentSelectEntity documentSelectEntity = new DocumentSelectEntity();
        documentSelectEntity.setSpacesStoreId(nodeDAO.getSpacesStoreId());
        documentSelectEntity.setIsIndexedPropertyId(nodeDAO.getIsIndexedPropertyId());
        documentSelectEntity.setMaxItems(maxItems);
        documentSelectEntity.setSkipCount(skipCount);

        List<Node> result = new ArrayList<>();
        List<String> documents = nodeDAO.getDocuments(documentSelectEntity);
        for (String document : documents) {
            Node node = new Node();
            node.setNodeRef(new NodeRef(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE, document));
            result.add(node);
        }

        Integer totalSize = nodeDAO.countDocuments(documentSelectEntity);

        Paging paging  = Paging.valueOf(skipCount, maxItems);
        boolean hasMoreItems = (skipCount + result.size() < totalSize);
        return CollectionWithPagingInfo.asPaged(paging, result, hasMoreItems, totalSize);

    }

    public void setNodeDAO(ExtendedNodeDAOImpl nodeDAO) {
        this.nodeDAO = nodeDAO;
    }

}
