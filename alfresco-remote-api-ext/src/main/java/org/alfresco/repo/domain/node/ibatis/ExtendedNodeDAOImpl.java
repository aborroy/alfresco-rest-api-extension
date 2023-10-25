package org.alfresco.repo.domain.node.ibatis;

import org.mybatis.spring.SqlSessionTemplate;

import java.util.List;

public class ExtendedNodeDAOImpl extends NodeDAOImpl {

    private static final String SELECT_IS_INDEXED_PROPERTY_ID = "select_IsIndexedPropertyId";
    private static final String SELECT_SPACES_STORE_ID = "select_SpacesStoreId";
    private static final String SELECT_DOCUMENTS = "select_Documents";
    private static final String COUNT_DOCUMENTS = "count_Documents";

    private SqlSessionTemplate template;

    public Long getIsIndexedPropertyId() {
        return template.selectOne(SELECT_IS_INDEXED_PROPERTY_ID);
    }

    public Long getSpacesStoreId() {
        return template.selectOne(SELECT_SPACES_STORE_ID);
    }

    public List<String> getDocuments(DocumentSelectEntity documentSelectEntity) {
        return template.selectList(SELECT_DOCUMENTS, documentSelectEntity);
    }

    public Integer countDocuments(DocumentSelectEntity documentSelectEntity) {
        return template.selectOne(COUNT_DOCUMENTS, documentSelectEntity);
    }

    public void setSqlSessionTemplate(SqlSessionTemplate sqlSessionTemplate) {
        this.template = sqlSessionTemplate;
    }

}
