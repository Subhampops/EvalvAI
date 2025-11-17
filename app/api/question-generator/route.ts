import { NextRequest, NextResponse } from 'next/server'

const mockQuestions = {
  DSA: {
    Easy: [
      {
        text: 'Write a function to reverse an array in place.',
        hint: 'Use two pointers, one at start and one at end. Swap elements and move pointers toward center.',
        sampleAnswer: 'Use two pointers approach. Initialize left=0, right=n-1. While left < right, swap arr[left] and arr[right], then increment left and decrement right.'
      },
      {
        text: 'Find the maximum element in an array.',
        hint: 'Iterate through the array once, keeping track of the maximum seen so far.',
        sampleAnswer: 'Initialize max with first element, then iterate through remaining elements updating max whenever a larger element is found. Time: O(n), Space: O(1)'
      }
    ],
    Medium: [
      {
        text: 'Implement binary search on a sorted array.',
        hint: 'Divide the search space in half at each step by comparing with middle element.',
        sampleAnswer: 'Initialize left=0, right=n-1. While left<=right, mid=(left+right)/2. If arr[mid]==target return mid. If arr[mid]<target, left=mid+1, else right=mid-1. Time: O(logn)'
      },
      {
        text: 'Find all pairs in an array that sum to a target value.',
        hint: 'Use a hash set to store seen elements. For each element, check if (target - element) exists in the set.',
        sampleAnswer: 'Use hash set approach. Store elements in a set, for each element check if (target-element) exists. Time: O(n), Space: O(n)'
      }
    ],
    Hard: [
      {
        text: 'Solve the Longest Increasing Subsequence (LIS) problem.',
        hint: 'Use dynamic programming. dp[i] represents length of LIS ending at index i.',
        sampleAnswer: 'DP approach: For each i, check all j<i. If arr[j]<arr[i], dp[i]=max(dp[i], dp[j]+1). Time: O(n²). Or use binary search for O(nlogn).'
      }
    ]
  },
  Reasoning: {
    Easy: [
      {
        text: 'If all roses are flowers and some flowers fade quickly, can we conclude some roses fade quickly?',
        hint: 'This is a logical deduction problem. Think about Venn diagrams.',
        sampleAnswer: 'No, we cannot conclude this. Just because roses are flowers and some flowers fade quickly doesn\'t mean those specific flowers that fade are roses.'
      }
    ],
    Medium: [
      {
        text: 'In a row of 5 people, A is to the left of B, and C is to the right of B. What can we determine?',
        hint: 'Use positional relationships to determine relative ordering.',
        sampleAnswer: 'We know A is left of B, and C is right of B. So: A < B < C. We cannot determine absolute positions of D and E or their exact order.'
      }
    ]
  },
  Quant: {
    Easy: [
      {
        text: 'What is 15% of 200?',
        hint: 'Percentage = (number * percentage) / 100',
        sampleAnswer: '15% of 200 = (15 * 200) / 100 = 3000 / 100 = 30'
      }
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    const { category, difficulty, count } = await request.json()

    const categoryQuestions = mockQuestions[category as keyof typeof mockQuestions] || mockQuestions.DSA
    const difficultyQuestions = categoryQuestions[difficulty as keyof typeof categoryQuestions] || categoryQuestions.Easy

    const selectedQuestions = difficultyQuestions
      .slice(0, count)
      .map((q, idx) => ({
        id: `q-${idx}`,
        text: q.text,
        category,
        difficulty,
        hint: q.hint,
        sampleAnswer: q.sampleAnswer
      }))

    return NextResponse.json({
      questions: selectedQuestions,
      totalCount: selectedQuestions.length
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to generate questions' },
      { status: 500 }
    )
  }
}
