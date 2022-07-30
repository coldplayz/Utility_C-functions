#include<stdio.h>
int main()
{
	int row, column;
	scanf("%d", &row);
	scanf("%d", &column);
	/* 2D array declaration*/
	printf("Enter column, followed by row number:\n");
	int abc[row][column];
	printf("column: %d\n", column);
	printf("row: %d\n", row);
	/*Counter variables for the loop*/
	int i, j;

	for (i = 0; i < row; i++)
	{
	  for (j = 0; j < column; j++)
	  {
		 printf("Enter value for abc[%d][%d]:", i, j);
		 scanf("%d", &abc[i][j]);
	  }
	}

	/*Displaying array elements*/
	printf("Two Dimensional array elements:\n");
	for ( i = 0; i < row; i++)
	{
	  for (j = 0; j < column; j++)
	  {
		 printf("%d ", abc[i][j]);
		 if (j == column - 1)
		 {
			printf("\n");
		 }
	  }
	}
	return (0);
}
