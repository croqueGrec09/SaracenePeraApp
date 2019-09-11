<?xml version="1.0" encoding="UTF-8"?>
<!-- Andreas Gálffy, matricula number 5584124, seminary Experimentelle Historische Informationssysteme, winter term '16/'17 -->
<!-- XSL stylesheet to generate a TEI document from the internal XML storage -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <!-- as parameter: the work number to pick -->
    <xsl:param name="werkid" select="0001"/>
    <xsl:template match="Sarazenen">
        <xsl:apply-templates/>
    </xsl:template>
    <!-- filter off everything what does not belong to the selected document -->
    <xsl:template match="Personen|Orte|Dokumente[WerkId!=$werkid]"/>
    <!-- create teiCorpus as representation of the work. A TEI-corpus of documents 
        represents a work of found sources. Each source is represented by a TEI document. -->
    <xsl:template match="Dokumente[WerkId=$werkid]">
        <teiCorpus xmlns="http://www.tei-c.org/ns/1.0">
            <!-- work header section -->
            <teiHeader>
                <!-- description of file -->
                <fileDesc>
                    <!-- each file is attributed with a unique xml-id, pattern W_work number -->
                    <xsl:attribute name="xml:id">W_<xsl:value-of select="WerkId"/></xsl:attribute>
                    <titleStmt>
                        <!-- display all title variants, with typised attributes -->
                        <xsl:element name="title">
                            <xsl:attribute name="type">orig</xsl:attribute>
                            <xsl:attribute name="xml:lang">lat</xsl:attribute>
                            <xsl:value-of select="WerkTitel"/>
                        </xsl:element>
                        <xsl:for-each select="Alternativtitel/Titel">
                            <title>
                                <xsl:attribute name="type">alt</xsl:attribute>
                                <xsl:attribute name="xml:lang">deu</xsl:attribute> <!-- vorläufig -->
                            </title>
                        </xsl:for-each>
                        <!-- display author name and life dates if known -->
                        <author>
                            <xsl:for-each select="Autoren/Autor">
                                <persName>
                                    <xsl:value-of select="."/>
                                </persName>
                            </xsl:for-each>
                            <date>
                                <xsl:attribute name="type">lifeDates</xsl:attribute>
                                <xsl:attribute name="from-iso"><xsl:value-of select="substring(LebensdatenVerfasser,1,4)"/>-00-00</xsl:attribute>
                                <xsl:attribute name="to-iso"><xsl:value-of select="substring(LebensdatenVerfasser,6,4)"/>-00-00</xsl:attribute>
                            </date>
                        </author>
                    </titleStmt>
                    <!-- display publication statement, please insert license status or similar if the rights are 
                    cleared! -->
                    <publicationStmt>
                        <p>TBD sobald die Rechte geklärt sind, hier Rücksprache mit K. Gahbler/ Oe. Eide
                            halten!</p>
                    </publicationStmt>
                    <!-- display editorial remarks in bibliographical entry -->
                    <sourceDesc>
                        <bibl>
                            <xsl:value-of select="Editionshinweise"/>
                        </bibl>
                    </sourceDesc>
                </fileDesc>
                <!-- end header section -->
            </teiHeader>
            <!-- sources - for each source a TEI document -->
            <xsl:for-each select="Quellen/Quelle">
                <TEI>
                    <!-- source header section -->
                    <teiHeader>
                        <!-- each source is assigned a unique xml-id, pattern Q_work number_source number -->
                        <fileDesc>
                            <xsl:attribute name="xml:id">Q_<xsl:value-of select="/ParsedDocument/WerkId"/>_<xsl:value-of select="QuellenId"/></xsl:attribute>
                            <!-- title template: Quellenstelle number of source -->
                            <titleStmt>
                                <title>Quellenstelle <xsl:value-of select="QuellenId"/></title>
                            </titleStmt>
                            <!-- publication statement, to be filled as soon as sort of project is decided -->
                            <publicationStmt>
                                <p>TBD sobald die Rechte geklärt sind, hier Rücksprache mit K. Gahbler/ Oe. Eide
                                    halten!</p>
                            </publicationStmt>
                            <!-- description of source origin -->
                            <sourceDesc>
                                <!-- citation of original text and translation -->
                                <bibl type="origCit"><xsl:value-of select="Zitation"/></bibl>
                                <bibl type="transCit"><xsl:value-of select="ZitationUebersetzung"/></bibl>
                                <!-- description of original text history -->
                                <msDesc>
                                    <!-- identifier data -->
                                    <msIdentifier>
                                        <region><xsl:value-of select="/ParsedDocument/Regionen/Region"/></region>
                                        <settlement><xsl:value-of select="/ParsedDocument/Abfassungsort"/></settlement>
                                        <idno><xsl:value-of select="/ParsedDocument/WerkId"/></idno>
                                    </msIdentifier>
                                    <!-- indication of dates of origin - when the source is dated and when the happening -->
                                    <history>
                                        <origin>
                                            <origDate>
                                                <xsl:attribute name="type">source</xsl:attribute>
                                                <xsl:value-of select="ZeitangabeQuelle"/>
                                            </origDate>
                                            <origDate>
                                                <xsl:attribute name="type">scientific</xsl:attribute>
                                                <xsl:value-of select="ZeitangabeWissenschaft/Datum/@Text"/>
                                                <date>
                                                    <xsl:attribute name="from-iso"><xsl:value-of select="ZeitangabeWissenschaft/Datum/@From"/></xsl:attribute>
                                                    <xsl:attribute name="to-iso"><xsl:value-of select="ZeitangabeWissenschaft/Datum/@To"/></xsl:attribute>
                                                </date>
                                            </origDate>
                                        </origin>
                                    </history>
                                </msDesc>
                            </sourceDesc>
                        </fileDesc>
                        <!-- description of profile -->
                        <profileDesc>
                            <!-- description of summary and keywords -->
                            <abstract>
                                <p>
                                    <xsl:value-of select="Inhaltsangabe"/>
                                </p>
                                <list>
                                    <xsl:for-each select="Auffaelligkeiten/Schlagwort">
                                        <item><xsl:value-of select="."/></item>
                                    </xsl:for-each>
                                </list>
                            </abstract>
                            <!-- description of work information -->
                            <creation>
                                <xsl:value-of select="ancestor::Dokumente/Werkinformation"/>
                            </creation>
                            <!-- description of places -->
                            <settingDesc>
                                <!-- from the list of geographic places -->
                                <listPlace type="keywords">
                                    <xsl:for-each select="GeographischesStichwort/Ort">
                                        <place>
                                            <placeName>
                                                <xsl:value-of select="."/>
                                            </placeName>
                                        </place>
                                    </xsl:for-each>
                                </listPlace>
                                <!-- from the list of parsed entities -->
                                <xsl:if test="count(Entitaeten/Entitaet[@Type='Ort']) > 0">
                                    <listPlace type="named">
                                        <xsl:for-each select="Entitaeten/Entitaet[@Type='Ort']">
                                            <place>
                                                <!-- for each entity in the text, there is an ID and a name -->
                                                <placeName>
                                                    <xsl:attribute name="key"><xsl:value-of select="@Id"/></xsl:attribute>
                                                    <xsl:value-of select="Name"/>
                                                </placeName>
                                            </place>
                                        </xsl:for-each>
                                    </listPlace>
                                </xsl:if>
                            </settingDesc>
                            <!-- description of interacting persons -->
                            <particDesc>
                                <!-- from the enumeration in the document -->
                                <listPerson type="concerned">
                                    <xsl:for-each select="Beteiligte/Beteiligter">
                                        <xsl:choose>
                                            <!-- collective -->
                                            <xsl:when test="substring(.,2,1) = 'K'">
                                                <personGrp>
                                                    <!-- the "role"-attribute keeps the nationality -->
                                                    <xsl:attribute name="role"><xsl:value-of select="substring(.,1,1)"/></xsl:attribute>
                                                </personGrp>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <person>
                                                    <xsl:attribute name="role"><xsl:value-of select="substring(.,1,1)"/></xsl:attribute>
                                                </person>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:for-each>
                                </listPerson>
                                <!-- from the full text -->
                                <xsl:if test="count(Entitaeten/Entitaet[@Type='Person']) > 0">
                                    <listPerson type="named">
                                        <xsl:for-each select="Entitaeten/Entitaet[@Type='Person']">
                                            <person>
                                                <persName>
                                                    <xsl:attribute name="key"><xsl:value-of select="@Id"/></xsl:attribute>
                                                    <xsl:value-of select="Name"/>
                                                </persName>
                                            </person>
                                        </xsl:for-each>
                                    </listPerson>
                                </xsl:if>
                            </particDesc>
                            <!-- list of characterising keywords -->
                            <textClass>
                                <keywords>
                                    <xsl:for-each select="Suchbegriffe/Suchwort">
                                        <term><xsl:value-of select="."/></term>
                                    </xsl:for-each>
                                </keywords>
                            </textClass>
                            <!-- desctiption of text nature - all values are predefined except the interaction which comes from the document -->
                            <textDesc>
                                <channel>geschriebener Text</channel>
                                <constitution>komplett</constitution>
                                <derivation>original</derivation>
                                <domain>Nachwelt, zeitgenössische Leser</domain>
                                <factuality>nein</factuality>
                                <interaction><xsl:value-of select="Interaktion"/></interaction>
                                <preparedness>ja</preparedness>
                                <purpose>Bericht</purpose>
                            </textDesc>
                        </profileDesc>
                        <!-- end of source metadata section -->
                    </teiHeader>
                    <!-- full texts of sources - divised into original and translation -->
                    <text>
                        <body>
                            <div type="fulltext" xml:lang="lat">
                                <p><xsl:value-of select="VolltextOriginalsprache"/></p>
                            </div>
                            <div type="translation" xml:lang="de">
                                <p><xsl:value-of select="VolltextUebersetzung"/></p>
                            </div>
                        </body>
                    </text>
                </TEI>
            </xsl:for-each>
        </teiCorpus>
    </xsl:template>
</xsl:stylesheet>