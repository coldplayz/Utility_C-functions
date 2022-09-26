#include <stdio.h>

int int2mod(int num, int mod);


/**
 * This function implements the Extended Euclidean
 * Algorithm for finding the inverse of num in mod 'mod'.
 */
int mod_inverse(int num, int mod)
{
	int i, prev_rem, rem, dvsor, dvdnd, new_p, p1 = 0, p2 = 1;
	int quot[] = {-1, -1, -1};

	dvdnd = mod;
	dvsor = num;

	rem = 1;
	for (i = 0; rem > 0; i++)
	{
		prev_rem = rem;
		rem = dvdnd % dvsor;
		if (i < 2)
		{
			quot[i] = dvdnd / dvsor;
		}
		else
		{
			/* always write further quotient values at quot[2] */
			quot[2] = dvdnd / dvsor;
		}

		dvdnd = dvsor;
		dvsor = rem;

		if (i > 1)
		{
			/* always read quotient values from quot[0] */
			new_p = p1 - (p2 * quot[0]);
			/* shift quot[] values up after reading from quot[0] */
			quot[0] = quot[1];
			quot[1] = quot[2];

			/* express new_p in specified mod */
			new_p = int2mod(new_p, mod);
			/* update p1 and p2 values */
			p1 = p2;
			p2 = new_p;
		}
	}
	
	if (prev_rem == 1)
	{
		/* calculate one last new_p value */
		new_p = p1 - (p2 * quot[0]);
	}
	else
	{
		fprintf(stderr, "No inverse for %d in mod %d\n", num, mod);
		return (-1);
	}

	return (int2mod(new_p, mod));
}
