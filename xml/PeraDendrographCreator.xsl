<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:TEI="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs TEI"
    version="2.0">
    <xsl:template match="/">
        <dendrograph xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="dendrograph.xsd">
            <remarkabilities name="pera">
                <superCategory name="Auffälligkeiten">
                    <xsl:for-each select="distinct-values(//TEI:keywords[@n='remarkabilities']/TEI:term)">
                        <remarkability><xsl:value-of select="."/></remarkability>
                    </xsl:for-each>
                </superCategory>
                <superCategory name="Handelswaren">
                    <xsl:for-each select="distinct-values(//TEI:keywords[@n='tradeGoods']/TEI:term)">
                        <remarkability><xsl:value-of select="."/></remarkability>
                    </xsl:for-each>
                </superCategory>
            </remarkabilities>
        </dendrograph>
    </xsl:template>
</xsl:stylesheet>