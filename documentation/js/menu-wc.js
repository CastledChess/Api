'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">castled-api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AnalysisModule.html" data-type="entity-link" >AnalysisModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AnalysisModule-c6360905406e127f660109890607bf2ad79c8855583dcf91376902639617f9dbd8a0efbf08d2061bf6efc3fb8af0b1b286f4d85d8ae69a5b53205e34813e4fda"' : 'data-bs-target="#xs-controllers-links-module-AnalysisModule-c6360905406e127f660109890607bf2ad79c8855583dcf91376902639617f9dbd8a0efbf08d2061bf6efc3fb8af0b1b286f4d85d8ae69a5b53205e34813e4fda"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AnalysisModule-c6360905406e127f660109890607bf2ad79c8855583dcf91376902639617f9dbd8a0efbf08d2061bf6efc3fb8af0b1b286f4d85d8ae69a5b53205e34813e4fda"' :
                                            'id="xs-controllers-links-module-AnalysisModule-c6360905406e127f660109890607bf2ad79c8855583dcf91376902639617f9dbd8a0efbf08d2061bf6efc3fb8af0b1b286f4d85d8ae69a5b53205e34813e4fda"' }>
                                            <li class="link">
                                                <a href="controllers/AnalysisController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnalysisController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AnalysisModule-c6360905406e127f660109890607bf2ad79c8855583dcf91376902639617f9dbd8a0efbf08d2061bf6efc3fb8af0b1b286f4d85d8ae69a5b53205e34813e4fda"' : 'data-bs-target="#xs-injectables-links-module-AnalysisModule-c6360905406e127f660109890607bf2ad79c8855583dcf91376902639617f9dbd8a0efbf08d2061bf6efc3fb8af0b1b286f4d85d8ae69a5b53205e34813e4fda"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AnalysisModule-c6360905406e127f660109890607bf2ad79c8855583dcf91376902639617f9dbd8a0efbf08d2061bf6efc3fb8af0b1b286f4d85d8ae69a5b53205e34813e4fda"' :
                                        'id="xs-injectables-links-module-AnalysisModule-c6360905406e127f660109890607bf2ad79c8855583dcf91376902639617f9dbd8a0efbf08d2061bf6efc3fb8af0b1b286f4d85d8ae69a5b53205e34813e4fda"' }>
                                        <li class="link">
                                            <a href="injectables/AnalysisService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnalysisService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/InfoResultsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InfoResultsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MovesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MovesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-ed84d2ccec65ca0d7847aac876358fc84b75658c662eb1de33a0f8f80b78a45d9e8327664c11d61072c42f9d0d2c64f856beac3b70fdbb9c27b85752778e27df"' : 'data-bs-target="#xs-controllers-links-module-AppModule-ed84d2ccec65ca0d7847aac876358fc84b75658c662eb1de33a0f8f80b78a45d9e8327664c11d61072c42f9d0d2c64f856beac3b70fdbb9c27b85752778e27df"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-ed84d2ccec65ca0d7847aac876358fc84b75658c662eb1de33a0f8f80b78a45d9e8327664c11d61072c42f9d0d2c64f856beac3b70fdbb9c27b85752778e27df"' :
                                            'id="xs-controllers-links-module-AppModule-ed84d2ccec65ca0d7847aac876358fc84b75658c662eb1de33a0f8f80b78a45d9e8327664c11d61072c42f9d0d2c64f856beac3b70fdbb9c27b85752778e27df"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-ed84d2ccec65ca0d7847aac876358fc84b75658c662eb1de33a0f8f80b78a45d9e8327664c11d61072c42f9d0d2c64f856beac3b70fdbb9c27b85752778e27df"' : 'data-bs-target="#xs-injectables-links-module-AppModule-ed84d2ccec65ca0d7847aac876358fc84b75658c662eb1de33a0f8f80b78a45d9e8327664c11d61072c42f9d0d2c64f856beac3b70fdbb9c27b85752778e27df"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-ed84d2ccec65ca0d7847aac876358fc84b75658c662eb1de33a0f8f80b78a45d9e8327664c11d61072c42f9d0d2c64f856beac3b70fdbb9c27b85752778e27df"' :
                                        'id="xs-injectables-links-module-AppModule-ed84d2ccec65ca0d7847aac876358fc84b75658c662eb1de33a0f8f80b78a45d9e8327664c11d61072c42f9d0d2c64f856beac3b70fdbb9c27b85752778e27df"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthenticationModule.html" data-type="entity-link" >AuthenticationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthenticationModule-3ca78a4919224c003329f3766aae50fac2b34d32222278e09ba43e801ed5a473b69f7f4ff6a6f729a158904bcc380173ceb75c1668c297ce3f247aeb17d0cc74"' : 'data-bs-target="#xs-controllers-links-module-AuthenticationModule-3ca78a4919224c003329f3766aae50fac2b34d32222278e09ba43e801ed5a473b69f7f4ff6a6f729a158904bcc380173ceb75c1668c297ce3f247aeb17d0cc74"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthenticationModule-3ca78a4919224c003329f3766aae50fac2b34d32222278e09ba43e801ed5a473b69f7f4ff6a6f729a158904bcc380173ceb75c1668c297ce3f247aeb17d0cc74"' :
                                            'id="xs-controllers-links-module-AuthenticationModule-3ca78a4919224c003329f3766aae50fac2b34d32222278e09ba43e801ed5a473b69f7f4ff6a6f729a158904bcc380173ceb75c1668c297ce3f247aeb17d0cc74"' }>
                                            <li class="link">
                                                <a href="controllers/AuthenticationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthenticationModule-3ca78a4919224c003329f3766aae50fac2b34d32222278e09ba43e801ed5a473b69f7f4ff6a6f729a158904bcc380173ceb75c1668c297ce3f247aeb17d0cc74"' : 'data-bs-target="#xs-injectables-links-module-AuthenticationModule-3ca78a4919224c003329f3766aae50fac2b34d32222278e09ba43e801ed5a473b69f7f4ff6a6f729a158904bcc380173ceb75c1668c297ce3f247aeb17d0cc74"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthenticationModule-3ca78a4919224c003329f3766aae50fac2b34d32222278e09ba43e801ed5a473b69f7f4ff6a6f729a158904bcc380173ceb75c1668c297ce3f247aeb17d0cc74"' :
                                        'id="xs-injectables-links-module-AuthenticationModule-3ca78a4919224c003329f3766aae50fac2b34d32222278e09ba43e801ed5a473b69f7f4ff6a6f729a158904bcc380173ceb75c1668c297ce3f247aeb17d0cc74"' }>
                                        <li class="link">
                                            <a href="injectables/AuthenticationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ChessModule.html" data-type="entity-link" >ChessModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ChessModule-eef023f003bf3c3929d53fbc393862442bfab02a8c678a74bab23cc071085203bb49ef7ab0491803c970a4505c62bfef78b734a5cdd9cff4dc8bc6afa38ec5fb"' : 'data-bs-target="#xs-controllers-links-module-ChessModule-eef023f003bf3c3929d53fbc393862442bfab02a8c678a74bab23cc071085203bb49ef7ab0491803c970a4505c62bfef78b734a5cdd9cff4dc8bc6afa38ec5fb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ChessModule-eef023f003bf3c3929d53fbc393862442bfab02a8c678a74bab23cc071085203bb49ef7ab0491803c970a4505c62bfef78b734a5cdd9cff4dc8bc6afa38ec5fb"' :
                                            'id="xs-controllers-links-module-ChessModule-eef023f003bf3c3929d53fbc393862442bfab02a8c678a74bab23cc071085203bb49ef7ab0491803c970a4505c62bfef78b734a5cdd9cff4dc8bc6afa38ec5fb"' }>
                                            <li class="link">
                                                <a href="controllers/ChessController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChessController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ChessModule-eef023f003bf3c3929d53fbc393862442bfab02a8c678a74bab23cc071085203bb49ef7ab0491803c970a4505c62bfef78b734a5cdd9cff4dc8bc6afa38ec5fb"' : 'data-bs-target="#xs-injectables-links-module-ChessModule-eef023f003bf3c3929d53fbc393862442bfab02a8c678a74bab23cc071085203bb49ef7ab0491803c970a4505c62bfef78b734a5cdd9cff4dc8bc6afa38ec5fb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ChessModule-eef023f003bf3c3929d53fbc393862442bfab02a8c678a74bab23cc071085203bb49ef7ab0491803c970a4505c62bfef78b734a5cdd9cff4dc8bc6afa38ec5fb"' :
                                        'id="xs-injectables-links-module-ChessModule-eef023f003bf3c3929d53fbc393862442bfab02a8c678a74bab23cc071085203bb49ef7ab0491803c970a4505c62bfef78b734a5cdd9cff4dc8bc6afa38ec5fb"' }>
                                        <li class="link">
                                            <a href="injectables/ChessService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChessService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ElitedbModule.html" data-type="entity-link" >ElitedbModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ElitedbModule-38febe4f3435d6bebee5008c3ecffb761680a6c2df2872a2e67ae530cd1d66315d0d79cac33fc25d5a1ceb5193d93ff67cc46969968ce14348ccb1d61f8e6bee"' : 'data-bs-target="#xs-controllers-links-module-ElitedbModule-38febe4f3435d6bebee5008c3ecffb761680a6c2df2872a2e67ae530cd1d66315d0d79cac33fc25d5a1ceb5193d93ff67cc46969968ce14348ccb1d61f8e6bee"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ElitedbModule-38febe4f3435d6bebee5008c3ecffb761680a6c2df2872a2e67ae530cd1d66315d0d79cac33fc25d5a1ceb5193d93ff67cc46969968ce14348ccb1d61f8e6bee"' :
                                            'id="xs-controllers-links-module-ElitedbModule-38febe4f3435d6bebee5008c3ecffb761680a6c2df2872a2e67ae530cd1d66315d0d79cac33fc25d5a1ceb5193d93ff67cc46969968ce14348ccb1d61f8e6bee"' }>
                                            <li class="link">
                                                <a href="controllers/ElitedbController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ElitedbController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ElitedbModule-38febe4f3435d6bebee5008c3ecffb761680a6c2df2872a2e67ae530cd1d66315d0d79cac33fc25d5a1ceb5193d93ff67cc46969968ce14348ccb1d61f8e6bee"' : 'data-bs-target="#xs-injectables-links-module-ElitedbModule-38febe4f3435d6bebee5008c3ecffb761680a6c2df2872a2e67ae530cd1d66315d0d79cac33fc25d5a1ceb5193d93ff67cc46969968ce14348ccb1d61f8e6bee"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ElitedbModule-38febe4f3435d6bebee5008c3ecffb761680a6c2df2872a2e67ae530cd1d66315d0d79cac33fc25d5a1ceb5193d93ff67cc46969968ce14348ccb1d61f8e6bee"' :
                                        'id="xs-injectables-links-module-ElitedbModule-38febe4f3435d6bebee5008c3ecffb761680a6c2df2872a2e67ae530cd1d66315d0d79cac33fc25d5a1ceb5193d93ff67cc46969968ce14348ccb1d61f8e6bee"' }>
                                        <li class="link">
                                            <a href="injectables/ElitedbService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ElitedbService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/InfoResultsModule.html" data-type="entity-link" >InfoResultsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-InfoResultsModule-60fc0792c34ea9c380205ea2bf56401eedcb2a1a0b85cfe2dd981cc3a3134709a1a68d97c836f329958c52ac2f74dea65886cdd00b3ededab0a60a72febb7d61"' : 'data-bs-target="#xs-injectables-links-module-InfoResultsModule-60fc0792c34ea9c380205ea2bf56401eedcb2a1a0b85cfe2dd981cc3a3134709a1a68d97c836f329958c52ac2f74dea65886cdd00b3ededab0a60a72febb7d61"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InfoResultsModule-60fc0792c34ea9c380205ea2bf56401eedcb2a1a0b85cfe2dd981cc3a3134709a1a68d97c836f329958c52ac2f74dea65886cdd00b3ededab0a60a72febb7d61"' :
                                        'id="xs-injectables-links-module-InfoResultsModule-60fc0792c34ea9c380205ea2bf56401eedcb2a1a0b85cfe2dd981cc3a3134709a1a68d97c836f329958c52ac2f74dea65886cdd00b3ededab0a60a72febb7d61"' }>
                                        <li class="link">
                                            <a href="injectables/InfoResultsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InfoResultsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MovesModule.html" data-type="entity-link" >MovesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MovesModule-cc59cf3917334c7d66a18c336be4cb63dc29c1c7410f5592d495004df72e037cf51896a98986361c329ff6cc3bdd01ba710067cdbf3dba394ac41a1ba71ace6a"' : 'data-bs-target="#xs-injectables-links-module-MovesModule-cc59cf3917334c7d66a18c336be4cb63dc29c1c7410f5592d495004df72e037cf51896a98986361c329ff6cc3bdd01ba710067cdbf3dba394ac41a1ba71ace6a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MovesModule-cc59cf3917334c7d66a18c336be4cb63dc29c1c7410f5592d495004df72e037cf51896a98986361c329ff6cc3bdd01ba710067cdbf3dba394ac41a1ba71ace6a"' :
                                        'id="xs-injectables-links-module-MovesModule-cc59cf3917334c7d66a18c336be4cb63dc29c1c7410f5592d495004df72e037cf51896a98986361c329ff6cc3bdd01ba710067cdbf3dba394ac41a1ba71ace6a"' }>
                                        <li class="link">
                                            <a href="injectables/MovesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MovesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-7173935e26a1c2766c4ebc70346dedac6c74c4d1c80de11341f786630c2d0999488219cb9c33b345903e483bcabe50347c179cf29a3581c780611a4956881b1d"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-7173935e26a1c2766c4ebc70346dedac6c74c4d1c80de11341f786630c2d0999488219cb9c33b345903e483bcabe50347c179cf29a3581c780611a4956881b1d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-7173935e26a1c2766c4ebc70346dedac6c74c4d1c80de11341f786630c2d0999488219cb9c33b345903e483bcabe50347c179cf29a3581c780611a4956881b1d"' :
                                            'id="xs-controllers-links-module-UsersModule-7173935e26a1c2766c4ebc70346dedac6c74c4d1c80de11341f786630c2d0999488219cb9c33b345903e483bcabe50347c179cf29a3581c780611a4956881b1d"' }>
                                            <li class="link">
                                                <a href="controllers/UserSettingsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserSettingsController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-7173935e26a1c2766c4ebc70346dedac6c74c4d1c80de11341f786630c2d0999488219cb9c33b345903e483bcabe50347c179cf29a3581c780611a4956881b1d"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-7173935e26a1c2766c4ebc70346dedac6c74c4d1c80de11341f786630c2d0999488219cb9c33b345903e483bcabe50347c179cf29a3581c780611a4956881b1d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-7173935e26a1c2766c4ebc70346dedac6c74c4d1c80de11341f786630c2d0999488219cb9c33b345903e483bcabe50347c179cf29a3581c780611a4956881b1d"' :
                                        'id="xs-injectables-links-module-UsersModule-7173935e26a1c2766c4ebc70346dedac6c74c4d1c80de11341f786630c2d0999488219cb9c33b345903e483bcabe50347c179cf29a3581c780611a4956881b1d"' }>
                                        <li class="link">
                                            <a href="injectables/UserSettingsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserSettingsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Analysis.html" data-type="entity-link" >Analysis</a>
                                </li>
                                <li class="link">
                                    <a href="entities/AnalysisMove.html" data-type="entity-link" >AnalysisMove</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ElitedbMove.html" data-type="entity-link" >ElitedbMove</a>
                                </li>
                                <li class="link">
                                    <a href="entities/InfoResult.html" data-type="entity-link" >InfoResult</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Move.html" data-type="entity-link" >Move</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserSettings.html" data-type="entity-link" >UserSettings</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AllExceptionsFilter.html" data-type="entity-link" >AllExceptionsFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Analysis.html" data-type="entity-link" >Analysis</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnalysisMoveResponseDto.html" data-type="entity-link" >AnalysisMoveResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnalysisResponseDto.html" data-type="entity-link" >AnalysisResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthenticationResponseDto.html" data-type="entity-link" >AuthenticationResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseDto.html" data-type="entity-link" >BaseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAnalysisDto.html" data-type="entity-link" >CreateAnalysisDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomBaseEntity.html" data-type="entity-link" >CustomBaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ElitedbMove.html" data-type="entity-link" >ElitedbMove</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserByEmailDto.html" data-type="entity-link" >GetUserByEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserByIdDto.html" data-type="entity-link" >GetUserByIdDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InfoResultResponseDto.html" data-type="entity-link" >InfoResultResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/JwtPayloadDto.html" data-type="entity-link" >JwtPayloadDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginRequestDto.html" data-type="entity-link" >LoginRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MoveResponseDto.html" data-type="entity-link" >MoveResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenRequestDto.html" data-type="entity-link" >RefreshTokenRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserPasswordDto.html" data-type="entity-link" >UpdateUserPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDto.html" data-type="entity-link" >UserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserSettingsDto.html" data-type="entity-link" >UserSettingsDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ChessPlayer.html" data-type="entity-link" >ChessPlayer</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});