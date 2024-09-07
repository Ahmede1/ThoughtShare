import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { VideosService } from 'src/app/services/videos.service';
import { DataHolderService } from 'src/app/services/data-holder.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatCheckbox } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatProgressBarModule,
    MatSelectModule,
    MatAutocompleteModule,
    FormsModule,
    MatCheckbox,
    TranslateModule
  ],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
})
export class SearchFilterComponent implements OnInit {


  difficultyLevelOptionalList: any[] = [];
  interactivityOptionalList: any[] = [];
  resourceTypeOptionalList: any[] = [];
  conceptMendatoryList: any[] = [];

  tags: any | null = null;

  selectedConcept: string = '';


  subjectAreas: any[] = [];
  branches: any[] = [];
  topics: any[] = [];
  subtopics: any[] = [];
  concepts: any[] = [];


  selectedSubjectArea: string = '';
  selectedBranch: string = '';
  selectedTopic: string = '';
  selectedSubtopic: string = '';

  filteredSubjectAreas: any[] = [];
  filteredBranches: any[] = [];
  filteredTopics: any[] = [];
  filteredSubtopics: any[] = [];
  filteredConcepts: any[] = [];



  LanguageOptions: string[] = ['English', 'Spanish', 'French', 'German', 'Chinese'];
  filteredLanguageOptions: string[];
  selectedLanguage: string = '';

  YearOptions: string[] = ['2020', '2021', '2022', '2023', '2024'];
  filteredYearOptions: string[] = [];
  selectedYear: string = '';

  selectedDifficultyLevel: string = '';
  selectedInteractivity: string = '';
  selectedResourceType: string = '';

  selectedAuthorIds: string[] = []

  filteredDifficultyLevels: any[] = [];
  filteredInteractivities: any[] = [];
  filteredResourceTypes: any[] = [];


  authorList: any[] = [];

  // authorList: any[] = [
  //   { _id: "64ddea3bc3d7285f90bc81a7", name: "John Doe" },
  //   { _id: "64ddea3bc3d7285f90bc81a8", name: "Jane Smith" },
  //   { _id: "64ddea3bc3d7285f90bc81a9", name: "Robert Johnson" },
  //   { _id: "64ddea3bc3d7285f90bc81aa", name: "Emily Davis" },
  //   { _id: "64ddea3bc3d7285f90bc81ab", name: "Michael Brown" },
  //   { _id: "64ddea3bc3d7285f90bc81ac", name: "Jessica Wilson" },
  //   { _id: "64ddea3bc3d7285f90bc81ad", name: "David Martinez" },
  //   { _id: "64ddea3bc3d7285f90bc81ae", name: "Sarah Lee" },
  //   { _id: "64ddea3bc3d7285f90bc81af", name: "Christopher Taylor" },
  //   { _id: "64ddea3bc3d7285f90bc81b0", name: "Amanda Anderson" }
  // ];



  constructor(
    public videoService: VideosService,
    public dataHolderService: DataHolderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SearchFilterComponent>,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.tags = this.dataHolderService.tags;
    this.authorList = this.dataHolderService.user.followings
    // console.log("this.tags==", this.tags)
    this.authorList = this.transformWithCheckBocList(this.authorList);
    console.log(this.authorList)
    if (this.tags) {
      this.subjectAreas = this.tags.SubjectArea;
      this.difficultyLevelOptionalList = this.tags.DifficultyLevel
      this.interactivityOptionalList = this.tags.Interactivity
      this.resourceTypeOptionalList = this.tags.ResourceType
    }
    this.route.queryParams.subscribe(params => {
      this.selectedSubjectArea = params['subjectarea'] || '';
      this.selectedBranch = params['branch'] || '';
      this.selectedTopic = params['topic'] || '';
      this.selectedSubtopic = params['subtopic'] || '';
      this.selectedConcept = params['concept'] || '';
      this.selectedDifficultyLevel = params['difficulty'] || '';
      this.selectedInteractivity = params['interactivity'] || '';
      this.selectedResourceType = params['resource'] || '';
      this.selectedLanguage = params['language'] || '';
      this.selectedYear = params['year'] || '';
      const authorsParam = params['authors'];
      if (authorsParam) {
        this.selectedAuthorIds = authorsParam.split(',');
        this.authorList.forEach(author => {
          if (this.selectedAuthorIds.includes(author._id)) {
            author.isSelected = true; 
          }
        });
      }
      // this.logParams();
      this.loadOptions();

    });

  }

  transformWithCheckBocList(list: any[]): any[] {
    return list.map(author => ({
      ...author,
      isSelected: false // Default value for isSelected
    }));
  }


  searchTerm: string = '';
  filteredAuthors = this.authorList.slice();

  @ViewChild('autoAuthor') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  toggleAuthorSelection(authorId: string, event: any) {
    const author = this.authorList.find(a => a._id === authorId);
    if (author) {
      author.isSelected = event.checked;
    }
  }


  filterOptions(type: string) {
    switch (type) {
      case 'subjectArea':
        this.filteredSubjectAreas = this.subjectAreas.filter(option =>
          option.name.toLowerCase().includes(this.selectedSubjectArea?.toLowerCase() || '')
        );
        break;
      case 'branch':
        this.filteredBranches = this.branches.filter(option =>
          option.name.toLowerCase().includes(this.selectedBranch?.toLowerCase() || '')
        );
        break;
      case 'topic':
        this.filteredTopics = this.topics.filter(option =>
          option.name.toLowerCase().includes(this.selectedTopic?.toLowerCase() || '')
        );
        break;
      case 'subtopic':
        this.filteredSubtopics = this.subtopics.filter(option =>
          option.name.toLowerCase().includes(this.selectedSubtopic?.toLowerCase() || '')
        );
        break;
      case 'concept':
        this.filteredConcepts = this.concepts.filter(option =>
          option.name.toLowerCase().includes(this.selectedConcept?.toLowerCase() || '')
        );
        break;
      case 'language':
        this.filteredLanguageOptions = this.LanguageOptions.filter(option =>
          option.toLowerCase().includes(this.selectedLanguage?.toLowerCase() || '')
        );
        break;
      case 'year':
        this.filteredYearOptions = this.YearOptions.filter(year =>
          year.toLowerCase().includes(this.selectedYear?.toLowerCase() || '')
        );
        break;
      case 'difficultyLevel':
        this.filteredDifficultyLevels = this.difficultyLevelOptionalList.filter(option =>
          option.name.toLowerCase().includes(this.selectedDifficultyLevel?.toLowerCase() || '')
        );
        break;
      case 'interactivity':
        this.filteredInteractivities = this.interactivityOptionalList.filter(option =>
          option.name.toLowerCase().includes(this.selectedInteractivity?.toLowerCase() || '')
        );
        break;
      case 'resourceType':
        this.filteredResourceTypes = this.resourceTypeOptionalList.filter(option =>
          option.name.toLowerCase().includes(this.selectedResourceType?.toLowerCase() || '')
        );
        break;
      case 'authorList':
        const filterValue = this.searchTerm ? this.searchTerm.toLowerCase() : '';
        this.filteredAuthors = this.authorList.filter(author =>
          author.screenName.toLowerCase().includes(filterValue)
        );
        break;
      default:
        break;
    }
  }

  showDropdowns(type: string) {
    switch (type) {
      case 'subjectArea':
        this.filteredSubjectAreas = this.subjectAreas;
        break;
      case 'branch':
        this.filteredBranches = this.branches;
        break;
      case 'topics':
        this.filteredTopics = this.topics;
        break;
      case 'subtopic':
        this.filteredSubtopics = this.subtopics;
        break;
      case 'concept':
        this.filteredConcepts = this.concepts;
        break;
      case 'language':
        this.filteredLanguageOptions = this.LanguageOptions;
        break;
      case 'year':
        this.filteredYearOptions = this.YearOptions;
        break;
      case 'difficultyLevel':
        this.filteredDifficultyLevels = this.difficultyLevelOptionalList;
        break;
      case 'interactivity':
        this.filteredInteractivities = this.interactivityOptionalList;
        break;
      case 'resourceType':
        this.filteredResourceTypes = this.resourceTypeOptionalList;
        break;
      case 'authorList':
        this.filteredAuthors = this.authorList;
        break;

      default:
        break
    }
  }

  loadOptions(): void {

    const matchedSubjectArea = this.subjectAreas.find(subjectArea => subjectArea.name === this.selectedSubjectArea);
    if (matchedSubjectArea) {
      this.onSubjectAreaChange(matchedSubjectArea, true);
    }

    ///optinal filter list
    if (this.selectedDifficultyLevel) {
      const matchedDifficultyLevel = this.difficultyLevelOptionalList.find(difficulty => difficulty.name === this.selectedDifficultyLevel);
      if (matchedDifficultyLevel) {
        this.selectedDifficultyLevel = matchedDifficultyLevel.id;
      }
    }

    if (this.selectedInteractivity) {
      const matchedInteractivity = this.interactivityOptionalList.find(interactivity => interactivity.name === this.selectedInteractivity);
      if (matchedInteractivity) {
        this.selectedInteractivity = matchedInteractivity.id;
      }
    }

    if (this.selectedResourceType) {
      const matchedResourceType = this.resourceTypeOptionalList.find(resourceType => resourceType.name === this.selectedResourceType);
      if (matchedResourceType) {
        this.selectedResourceType = matchedResourceType.id;
      }
    }

  }

  onSubjectAreaChange(event: any, viaRoute = false): void {
    var subjectAreaId: string = ''
    if (viaRoute) {
      subjectAreaId = event.id;
      this.selectedSubjectArea = event.name;
    } else {
      subjectAreaId = event.option.value.id;
      this.selectedSubjectArea = event.option.value.name;
    }
    this.branches = this.tags.Branch.filter((branch: any) => branch.parent === subjectAreaId);
    if (viaRoute) {
      const matchedBranch = this.branches.find(branch => branch.name === this.selectedBranch);
      if (matchedBranch) {
        this.selectedBranch = matchedBranch.name;
        this.onBranchChange(matchedBranch, viaRoute);
      }
      return
    }
    this.selectedBranch = ''
    this.filteredBranches = []

    this.selectedTopic = ''
    this.topics = [];
    this.filteredTopics = [];

    this.selectedSubtopic = ''
    this.subtopics = [];
    this.filteredSubtopics = [];

    this.selectedConcept = ''
    this.concepts = [];
    this.filteredConcepts = [];

  }

  onBranchChange(event: any, viaRoute = false): void {
    var branchId: string = '';
    if (viaRoute) {
      branchId = event.id;
      this.selectedBranch = event.name;
    } else {
      branchId = event.option.value.id;
      this.selectedBranch = event.option.value.name;
    }
    this.topics = this.tags.Topic.filter((topic: any) => topic.parent === branchId);
    if (viaRoute) {
      const matchedTopic = this.topics.find(topic => topic.name === this.selectedTopic);
      if (matchedTopic) {
        this.onTopicChange(matchedTopic, viaRoute);
      }
      return
    }
    this.selectedTopic = ''
    this.filteredTopics = [];

    this.selectedSubtopic = ''
    this.subtopics = [];
    this.filteredSubtopics = [];

    this.selectedConcept = ''
    this.concepts = [];
    this.filteredConcepts = [];

  }

  onTopicChange(event: any, viaRoute = false): void {
    var topicId: string = '';
    if (viaRoute) {
      topicId = event.id;
      this.selectedTopic = event.name;
    } else {
      topicId = event.option.value.id;
      this.selectedTopic = event.option.value.name;
    }
    this.subtopics = this.tags.Subtopic.filter((subtopic: any) => subtopic.parent === topicId);
    console.log("this.subtopics", this.subtopics)
    if (viaRoute) {
      const matchedSubtopic = this.subtopics.find(subtopic => subtopic.name === this.selectedSubtopic);
      if (matchedSubtopic) {
        this.onSubtopicChange(matchedSubtopic, viaRoute);
      }
      return

    }
    this.selectedSubtopic = ''
    this.filteredSubtopics = [];

    this.selectedConcept = ''
    this.concepts = [];
    this.filteredConcepts = [];



  }

  onSubtopicChange(event: any, viaRoute = false): void {
    var subtopicId: string = '';
    if (viaRoute) {
      subtopicId = event.id;
      this.selectedSubtopic = event.name;
    } else {
      subtopicId = event.option.value.id;
      this.selectedSubtopic = event.option.value.name;
    }
    this.concepts = this.tags.Concept.filter((concept: any) => concept.parent === subtopicId);
    if (viaRoute) {
      const matchedConcept = this.concepts.find(concept => concept.name === this.selectedConcept);
      if (matchedConcept) {
        this.onConceptChange(matchedConcept, true)
      }
      return
    }
    this.selectedConcept = ''
    this.filteredConcepts = [];


  }

  onConceptChange(event: any, viaRoute = false): void {
    var conceptId: string = ''
    if (viaRoute) {
      conceptId = event.id;
      this.selectedConcept = event.name
    } else {
      conceptId = event.option.value.id;
      this.selectedConcept = event.option.value.name
    }
  }

  closeDialog(): void {
    // Deselect all selected options
    this.selectedSubjectArea = '';
    this.selectedBranch = '';
    this.selectedTopic = '';
    this.selectedSubtopic = '';
    this.selectedDifficultyLevel = '';
    this.selectedInteractivity = '';
    this.selectedResourceType = '';
    this.selectedConcept = '';

    // Close the dialog
    this.dialogRef.close();
  }

  logParams(): void {
    console.log('Language:', this.selectedLanguage);
    console.log('Year:', this.selectedYear);
    console.log('Subject Area:', this.selectedSubjectArea);
    console.log('Branch:', this.selectedBranch);
    console.log('Topic:', this.selectedTopic);
    console.log('Subtopic:', this.selectedSubtopic);
    console.log('Difficulty Level:', this.selectedDifficultyLevel);
    console.log('Interactivity:', this.selectedInteractivity);
    console.log('Resource Type:', this.selectedResourceType);
    console.log('Concept:', this.selectedConcept);
  }

  ApplyFilter(): void {
    console.log(this.dataHolderService.user)

    const selectedAuthorIds = this.authorList
      .filter(author => author.isSelected)
      .map(author => author._id);

    const stringFilter = {
      subjectarea: this.selectedSubjectArea,
      branch: this.selectedBranch,
      topic: this.selectedTopic,
      subtopic: this.selectedSubtopic,
      concept: this.selectedConcept,
      difficulty: this.selectedDifficultyLevel,
      interactivity: this.selectedInteractivity,
      resource: this.selectedResourceType,
    };

    const filters = {
      tags: stringFilter,
      language: this.selectedLanguage,
      year: this.selectedYear,
      authorIds: selectedAuthorIds.join(",")
    };

    console.log('Filters:', filters);
    this.dialogRef.close({ filters: filters });
  }

}
