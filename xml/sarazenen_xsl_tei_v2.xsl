<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:TEI="http://www.tei-c.org/ns/1.0"
    xmlns:uuid="java:java.util.UUID"
    exclude-result-prefixes="xs"
    version="2.0">
    <xsl:output indent="yes"/>
    <xsl:template match="Sarazenen">
        <xsl:processing-instruction name="xml-model" 
            select="('href=&quot;http://www.tei-c.org/release/xml/tei/custom/schema/relaxng/tei_corpus.rng&quot;',
            'type=&quot;application/xml&quot;', 'schematypens=&quot;http://relaxng.org/ns/structure/1.0&quot;')"/>
        <xsl:processing-instruction name="xml-model" 
            select="('href=&quot;http://www.tei-c.org/release/xml/tei/custom/schema/relaxng/tei_corpus.rng&quot;',
            'type=&quot;application/xml&quot;', 'schematypens=&quot;http://purl.oclc.org/dsdl/schematron&quot;')"/>
        <TEI:teiCorpus>
            <TEI:teiHeader>
                <TEI:fileDesc>
                    <TEI:titleStmt>
                        <TEI:title>TEI-based corpus of source material of Saracene project</TEI:title>
                        <TEI:author>Andreas Gálffy</TEI:author>
                    </TEI:titleStmt>
                    <TEI:publicationStmt>
                        <TEI:publisher>Universität zu Köln</TEI:publisher>
                        <TEI:availability>
                            <TEI:p xml:lang="de">
                                Diese Daten stammen aus einem zwischen 2013 und 2017 von der DFG geförderten Forschungsprojekt
                                „Saraceni, Mauri, Agareni, ... in lateinisch-christlichen Quellen des 7. bis 11. Jahrhunderts“,
                                das an der Rheinischen Friedrich-Wilhelms-Universität Bonn, Institut für Geschichtswissenschaft,
                                Abt. für Mittelalterliche Geschichte, das unter der Leitung von Prof. Dr. Matthias Becher und
                                unter Bearbeitung von Katharina Gahbler, M.A. läuft. Die Daten sind auf einem inzwischen sehr
                                veralteten Stand, die im Rahmen einer Lehrveranstaltung der Universität zu Köln
                                (Prof Dr. Oyvind Eide, HKI; Katharina Gahbler, M.A.) im Wintersemester 2016/17 zu Test- und
                                Entwicklungszwecken für eine App benutzt worden sind. Die Daten sind in dieser Form nicht für
                                eine wissenschaftliche Nachnutzung gedacht und nutzbar. Künftig sollen die überarbeiteten
                                Projektdaten an geeigneter Stelle publiziert und zur Nachnutzung bereitgestellt werden. Weitere
                                Information zu dem Projekt finden Sie unter:
                                <TEI:link target="https://www.igw.uni-bonn.de/de/abteilungsseiten/mittelalter/forschung/saraceni."/>
                            </TEI:p>
                        </TEI:availability>
                    </TEI:publicationStmt>
                    <TEI:sourceDesc>
                        <TEI:p>Digital conversion of word-documents</TEI:p>
                    </TEI:sourceDesc>
                </TEI:fileDesc>
                <TEI:profileDesc>
                    <TEI:particDesc>
                        <TEI:listPerson>
                            <xsl:for-each select="/Sarazenen/Personen/Person">
                                <TEI:person>
                                    <xsl:attribute name="xml:id" select="Id"/>
                                    <TEI:persName type="main">
                                        <xsl:value-of select="Name"/>
                                    </TEI:persName>
                                    <xsl:for-each select="Alternativnamen/Name">
                                        <TEI:persName type="alt"><xsl:value-of select="."/></TEI:persName>
                                    </xsl:for-each>
                                    <TEI:note>
                                        <xsl:value-of select="Rolle"/>
                                    </TEI:note>
                                </TEI:person>
                            </xsl:for-each>
                        </TEI:listPerson>
                    </TEI:particDesc>
                    <TEI:settingDesc>
                        <TEI:listPlace>
                            <xsl:for-each select="/Sarazenen/Orte/Ort">
                                <TEI:place>
                                    <xsl:choose>
                                        <xsl:when test="Id and normalize-space(./Id)">
                                            <xsl:attribute name="xml:id" select="Id"/>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:attribute name="xml:id">
                                                <xsl:value-of select="concat('C',substring(uuid:randomUUID(),1))"/>
                                            </xsl:attribute>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                    <xsl:choose>
                                        <xsl:when test="contains(Typ,'Stadt')">
                                            <TEI:settlement>
                                                <TEI:placeName type="main">
                                                    <xsl:value-of select="Name"/>
                                                </TEI:placeName>
                                                <xsl:for-each select="Alternativnamen/Name">
                                                    <TEI:placeName type="alt">
                                                        <xsl:value-of select="."/>
                                                    </TEI:placeName>
                                                </xsl:for-each>
                                            </TEI:settlement>
                                        </xsl:when>
                                        <xsl:when test="Typ='Region'">
                                            <TEI:region>
                                                <TEI:placeName type="main">
                                                    <xsl:value-of select="Name"/>
                                                </TEI:placeName>
                                                <xsl:for-each select="Alternativnamen/Name">
                                                    <TEI:placeName type="alt">
                                                        <xsl:value-of select="."/>
                                                    </TEI:placeName>
                                                </xsl:for-each>
                                            </TEI:region>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:attribute name="type">
                                                <xsl:value-of select="Typ"/>
                                            </xsl:attribute>
                                            <TEI:placeName type="main">
                                                <xsl:value-of select="Name"/>
                                            </TEI:placeName>
                                            <xsl:for-each select="Alternativnamen/Name">
                                                <TEI:placeName type="alt">
                                                    <xsl:value-of select="."/>
                                                </TEI:placeName>
                                            </xsl:for-each>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                    <TEI:location type="point">
                                        <TEI:geo n="lat"><xsl:value-of select="geometry/location/lat"/></TEI:geo>
                                        <TEI:geo n="lng"><xsl:value-of select="geometry/location/lng"/></TEI:geo>
                                    </TEI:location>
                                    <TEI:location type="viewportSW">
                                        <TEI:geo n="lat"><xsl:value-of select="geometry/viewport/southwest/lat"/></TEI:geo>
                                        <TEI:geo n="lng"><xsl:value-of select="geometry/viewport/southwest/lng"/></TEI:geo>
                                    </TEI:location>
                                    <TEI:location type="viewportNE">
                                        <TEI:geo n="lat"><xsl:value-of select="geometry/viewport/northeast/lat"/></TEI:geo>
                                        <TEI:geo n="lng"><xsl:value-of select="geometry/viewport/northeast/lng"/></TEI:geo>
                                    </TEI:location>
                                </TEI:place>
                            </xsl:for-each>
                        </TEI:listPlace>
                    </TEI:settingDesc>
                </TEI:profileDesc>
            </TEI:teiHeader>
            <xsl:for-each select="//Dokumente">
                <TEI:TEI>
                    <xsl:attribute name="xml:id">
                        <xsl:value-of select="concat('work',WerkId)"/>
                    </xsl:attribute>
                    <TEI:teiHeader>
                        <TEI:fileDesc>
                            <TEI:titleStmt>
                                <TEI:title type="main"><xsl:value-of select="WerkTitel"/></TEI:title>
                                <xsl:for-each select="Alternativtitel/Titel">
                                    <TEI:title type="alt"><xsl:value-of select="."/></TEI:title>
                                </xsl:for-each>
                                <xsl:for-each select="Autoren/Autor">
                                    <TEI:author>
                                        <TEI:persName><xsl:value-of select="."/></TEI:persName>
                                        <TEI:date type="lifeDates"><xsl:value-of select="../../LebensdatenVerfasser"/></TEI:date>
                                    </TEI:author>
                                </xsl:for-each>
                            </TEI:titleStmt>
                            <TEI:publicationStmt>
                                <TEI:p/>
                            </TEI:publicationStmt>
                            <TEI:sourceDesc n="work">
                                <TEI:bibl>
                                    <xsl:value-of select="Editionshinweise"/>
                                </TEI:bibl>
                            </TEI:sourceDesc>
                            <xsl:for-each select="Quellen/Quelle">
                                <TEI:sourceDesc>
                                    <xsl:attribute name="n"><xsl:value-of select="concat('source',QuellenId)"/></xsl:attribute>
                                    <TEI:bibl type="source">
                                        <xsl:value-of select="Zitation"/>
                                    </TEI:bibl>
                                    <TEI:bibl type="translation">
                                        <xsl:value-of select="ZitationUebersetzung"/>
                                    </TEI:bibl>
                                </TEI:sourceDesc>
                            </xsl:for-each>
                        </TEI:fileDesc>
                        <TEI:profileDesc>
                            <TEI:creation>
                                <TEI:placeName><xsl:value-of select="Abfassungsort"/></TEI:placeName>
                                <TEI:date><xsl:value-of select="Abfassungszeitraum"/></TEI:date>
                            </TEI:creation>
                            <TEI:settingDesc>
                                <TEI:listPlace type="workRegions">
                                    <xsl:for-each select="Regionen/Region">
                                        <TEI:place><TEI:region><xsl:value-of select="."/></TEI:region></TEI:place>
                                    </xsl:for-each>
                                </TEI:listPlace>
                                <xsl:for-each select="Quellen/Quelle">
                                    <xsl:variable name="n">
                                        <xsl:value-of select="concat('source',QuellenId)"/>
                                    </xsl:variable>
                                    <xsl:if test="count(Entitaeten/Entitaet[@Type='Ort']) > 0">
                                        <TEI:listPlace type="entities">
                                            <xsl:attribute name="n"><xsl:value-of select="$n"/></xsl:attribute>
                                            <xsl:for-each select="Entitaeten/Entitaet[@Type='Ort']/Name">
                                                <TEI:place>
                                                    <xsl:variable name="placeName" select="."/>
                                                    <!--<xsl:value-of select="//Orte/Ort[Name=$placeName]/Id"/>-->
                                                    <xsl:attribute name="corresp"><xsl:value-of select="concat('#',//Orte/Ort[Name=$placeName][1]/Id)"/></xsl:attribute>
                                                </TEI:place>
                                            </xsl:for-each>
                                        </TEI:listPlace>
                                    </xsl:if>
                                    <TEI:setting>
                                        <xsl:attribute name="n"><xsl:value-of select="$n"/></xsl:attribute>
                                        <xsl:for-each select="ZeitangabeWissenschaft/Datum">
                                            <TEI:date type="scientific">
                                                <xsl:attribute name="from-iso"><xsl:value-of select="@From"/></xsl:attribute>
                                                <xsl:attribute name="to-iso"><xsl:value-of select="@To"/></xsl:attribute>
                                                <xsl:value-of select="@Text"/>
                                            </TEI:date>
                                        </xsl:for-each>
                                        <TEI:date type="source">
                                            <xsl:value-of select="ZeitangabeQuelle"/>
                                        </TEI:date>
                                    </TEI:setting>
                                </xsl:for-each>
                            </TEI:settingDesc>
                            <TEI:abstract n="work">
                                <TEI:p>
                                    <xsl:value-of select="Werkinformation"/>
                                </TEI:p>
                            </TEI:abstract>
                            <xsl:for-each select="Quellen/Quelle">
                                <xsl:variable name="n">
                                    <xsl:value-of select="concat('source',QuellenId)"/>
                                </xsl:variable>
                                <TEI:abstract>
                                    <xsl:attribute name="n"><xsl:value-of select="$n"/></xsl:attribute>
                                    <TEI:p n="summary">
                                        <xsl:value-of select="Inhaltsangabe"/>
                                    </TEI:p>
                                </TEI:abstract>
                                <TEI:particDesc>
                                    <xsl:attribute name="n"><xsl:value-of select="$n"/></xsl:attribute>
                                    <TEI:listPerson type="concerned">
                                        <xsl:for-each select="Beteiligte/Beteiligter">
                                            <xsl:variable name="role">
                                                <xsl:choose>
                                                    <xsl:when test="substring(.,1,1) = 's'">saracene</xsl:when>
                                                    <xsl:otherwise>other</xsl:otherwise>
                                                </xsl:choose>
                                            </xsl:variable>
                                            <xsl:choose>
                                                <xsl:when test="substring(.,2,1) = 'K'">
                                                    <TEI:personGrp>
                                                        <xsl:attribute name="role"><xsl:value-of select="$role"/></xsl:attribute>
                                                    </TEI:personGrp>
                                                </xsl:when>
                                                <xsl:otherwise>
                                                    <TEI:person>
                                                        <xsl:attribute name="role"><xsl:value-of select="$role"/></xsl:attribute>
                                                    </TEI:person>
                                                </xsl:otherwise>
                                            </xsl:choose>
                                        </xsl:for-each>
                                    </TEI:listPerson>
                                    <xsl:if test="count(Entitaeten/Entitaet[@Type='Person']) > 0">
                                        <TEI:listPerson type="entities">
                                            <xsl:for-each select="Entitaeten/Entitaet[@Type='Person']">
                                                <TEI:person>
                                                    <xsl:variable name="persName" select="Name"/>
                                                    <!--<xsl:value-of select="//Orte/Ort[Name=$placeName]/Id"/>-->
                                                    <xsl:attribute name="corresp"><xsl:value-of select="concat('#',//Personen/Person[Name=$persName][1]/Id)"/></xsl:attribute>
                                                </TEI:person>
                                            </xsl:for-each>
                                        </TEI:listPerson>
                                    </xsl:if>
                                </TEI:particDesc>
                                <TEI:textClass>
                                    <xsl:attribute name="n"><xsl:value-of select="$n"/></xsl:attribute>
                                    <xsl:if test="GeographischesStichwort">
                                        <TEI:keywords n="geo">
                                            <xsl:for-each select="GeographischesStichwort/Ort">
                                                <TEI:term><xsl:value-of select="."/></TEI:term>
                                            </xsl:for-each>
                                        </TEI:keywords>
                                    </xsl:if>
                                    <TEI:keywords n="remarkabilites">
                                        <xsl:for-each select="Auffaelligkeiten/Schlagwort">
                                            <TEI:term><xsl:value-of select="."/></TEI:term>
                                        </xsl:for-each>
                                    </TEI:keywords>
                                    <TEI:keywords n="searchTerms">
                                        <xsl:for-each select="Suchbegriffe/Suchwort">
                                            <TEI:term><xsl:value-of select="."/></TEI:term>
                                        </xsl:for-each>
                                    </TEI:keywords>
                                </TEI:textClass>
                                <TEI:textDesc>
                                    <xsl:attribute name="n"><xsl:value-of select="$n"/></xsl:attribute>
                                    <TEI:channel/>
                                    <TEI:constitution/>
                                    <TEI:derivation/>
                                    <TEI:domain/>
                                    <TEI:factuality/>
                                    <TEI:interaction><xsl:value-of select="Interaktion"/></TEI:interaction>
                                    <TEI:preparedness/>
                                    <TEI:purpose/>
                                </TEI:textDesc>
                            </xsl:for-each>
                        </TEI:profileDesc>
                    </TEI:teiHeader>
                    <xsl:for-each select="Quellen/Quelle">
                        <TEI:text>
                            <xsl:attribute name="n"><xsl:value-of select="concat('source',QuellenId)"/></xsl:attribute>
                            <TEI:body>
                                <TEI:div xml:lang="lat">
                                    <TEI:p>
                                        <xsl:value-of select="VolltextOriginalsprache"/>
                                    </TEI:p>
                                </TEI:div>
                                <TEI:div xml:lang="de">
                                    <TEI:p>
                                        <xsl:value-of select="VolltextUebersetzung"/>
                                    </TEI:p>
                                </TEI:div>
                            </TEI:body>
                            <xsl:if test="Anmerkungen">
                                <TEI:back>
                                    <TEI:p><xsl:value-of select="Anmerkungen"/></TEI:p>
                                </TEI:back>
                            </xsl:if>
                        </TEI:text>
                    </xsl:for-each>
                </TEI:TEI>
            </xsl:for-each>
        </TEI:teiCorpus>
    </xsl:template>
</xsl:stylesheet>