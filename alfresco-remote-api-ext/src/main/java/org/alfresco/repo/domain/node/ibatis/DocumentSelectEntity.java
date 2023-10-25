package org.alfresco.repo.domain.node.ibatis;

public class DocumentSelectEntity {

    private Long spacesStoreId;
    private Long isIndexedPropertyId;
    private Integer skipCount;
    private Integer maxItems;

    public Long getSpacesStoreId() {
        return spacesStoreId;
    }

    public void setSpacesStoreId(Long spacesStoreId) {
        this.spacesStoreId = spacesStoreId;
    }

    public Long getIsIndexedPropertyId() {
        return isIndexedPropertyId;
    }

    public void setIsIndexedPropertyId(Long isIndexedPropertyId) {
        this.isIndexedPropertyId = isIndexedPropertyId;
    }

    public Integer getSkipCount() {
        return skipCount;
    }

    public void setSkipCount(Integer skipCount) {
        this.skipCount = skipCount;
    }

    public Integer getMaxItems() {
        return maxItems;
    }

    public void setMaxItems(Integer maxItems) {
        this.maxItems = maxItems;
    }

}
