import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    MaterialDesignFramework,
    MaterialDesignFrameworkModule,
    Framework,
    FrameworkLibraryService,
    JsonSchemaFormModule, JsonSchemaFormService,
    WidgetLibraryService
} from 'angular2-json-schema-form';
import { TagInputModule } from 'ngx-chips';
import { ImageCropperModule } from 'ngx-img-cropper';
import { RatingModule } from 'ngx-rating';

import { XmSharedModule } from '../shared/shared.module';
import {
    AreaComponent,
    AttachmentCardComponent,
    AttachmentDetailDialogComponent,
    AttachmentListComponent,
    AttachmentService,
    AvatarDialogComponent,
    CalendarCardComponent,
    CalendarEventDialogComponent,
    CalendarService,
    CommentCardComponent,
    CommentDetailDialogComponent,
    CommentListComponent,
    CommentService,
    ContentService,
    EntityCardComponent,
    EntityDataCardComponent,
    EntityDetailDialogComponent,
    EntityDetailFabComponent,
    EntityListCardComponent,
    EntityListFabComponent,
    EntityStateComponent,
    EventService,
    FunctionCallDialogComponent,
    FunctionContextService,
    FunctionListSectionComponent,
    FunctionService,
    LinkDetailDialogComponent,
    LinkDetailNewSectionComponent,
    LinkDetailSearchSectionComponent,
    LinkedinProfileComponent,
    LinkedinDataItemComponent,
    LinkListCardComponent,
    LinkListComponent,
    LinkListTreeSectionComponent,
    LinkService,
    LocationDetailDialogComponent,
    LocationListCardComponent,
    LocationService,
    OsmPolygonDialogComponent,
    OverpassApiService,
    RatingListSectionComponent,
    RatingService,
    TagListSectionComponent,
    TagService,
    VoteService,
    XmEntityService,
    XmEntitySpecService,
    XmEntitySpecWrapperService,
    LocationCardNamePipe,
    StatesManagementDialogComponent
} from './';

import {StateChangeDialogComponent} from './state-change-dialog/state-change-dialog.component';
import {FunctionResultDialogComponent} from './function-result-dialog/function-result-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
        RouterModule,
        MaterialDesignFrameworkModule,
        {
            ngModule: JsonSchemaFormModule,
            providers: [
                JsonSchemaFormService,
                FrameworkLibraryService,
                WidgetLibraryService,
                {provide: Framework, useClass: MaterialDesignFramework, multi: true}
            ]
        },
        ImageCropperModule,
        RatingModule,
        TagInputModule
    ],
    declarations: [
        AreaComponent,
        AttachmentCardComponent,
        AttachmentDetailDialogComponent,
        AttachmentListComponent,
        AvatarDialogComponent,
        CalendarCardComponent,
        CalendarEventDialogComponent,
        CommentCardComponent,
        CommentDetailDialogComponent,
        CommentListComponent,
        EntityCardComponent,
        EntityDataCardComponent,
        EntityDetailDialogComponent,
        EntityDetailFabComponent,
        EntityListCardComponent,
        EntityListFabComponent,
        EntityStateComponent,
        FunctionCallDialogComponent,
        FunctionResultDialogComponent,
        StateChangeDialogComponent,
        FunctionListSectionComponent,
        LinkDetailDialogComponent,
        LinkDetailNewSectionComponent,
        LinkDetailSearchSectionComponent,
        LinkedinProfileComponent,
        LinkedinDataItemComponent,
        LinkListComponent,
        LinkListCardComponent,
        LinkListTreeSectionComponent,
        LocationDetailDialogComponent,
        LocationListCardComponent,
        OsmPolygonDialogComponent,
        RatingListSectionComponent,
        TagListSectionComponent,
        EntityListFabComponent,
        LocationCardNamePipe,
        StatesManagementDialogComponent
    ],
    entryComponents: [
        StatesManagementDialogComponent,
        AttachmentDetailDialogComponent,
        AvatarDialogComponent,
        CalendarEventDialogComponent,
        CommentDetailDialogComponent,
        EntityDetailDialogComponent,
        FunctionCallDialogComponent,
        FunctionResultDialogComponent,
        StateChangeDialogComponent,
        LinkDetailDialogComponent,
        LocationDetailDialogComponent,
        OsmPolygonDialogComponent
    ],
    exports: [
        AreaComponent,
        AttachmentCardComponent,
        AttachmentListComponent,
        CalendarCardComponent,
        CommentCardComponent,
        CommentListComponent,
        EntityCardComponent,
        EntityDataCardComponent,
        EntityDetailFabComponent,
        EntityListCardComponent,
        EntityListFabComponent,
        EntityStateComponent,
        FunctionListSectionComponent,
        LinkDetailNewSectionComponent,
        LinkDetailSearchSectionComponent,
        LinkListComponent,
        LinkListCardComponent,
        LocationListCardComponent,
        RatingListSectionComponent,
        TagListSectionComponent,
        StatesManagementDialogComponent
    ],
    providers: [
        AttachmentService,
        CalendarService,
        CommentService,
        ContentService,
        EventService,
        FunctionService,
        FunctionContextService,
        LinkService,
        LocationService,
        OverpassApiService,
        RatingService,
        TagService,
        VoteService,
        XmEntityService,
        XmEntitySpecService,
        XmEntitySpecWrapperService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class XmEntityModule {
}
